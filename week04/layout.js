function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if (element.style[prop].toString().match(/^[0-9\.]$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

function layout(element) {
    if (!element.computedStyle) {
        return (void 0);
    }

    let elementStyle = getStyle(element);

    // now, we only support the flex layout
    if (elementStyle.display !== "flex") {
        return (void 0);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize settings ////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // check children for layout, and skip text nodes
    let items = element
        .children
        .filter(child => child.type === "element");

    // support the order property
    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    });

    ['width', 'height'].forEach(size => {
        if (elementStyle[size] === "auto" || elementStyle[size] === '') {
            elementStyle[size] = null;
        }
    });

    // flexDirection's default value is "row".
    if (!elementStyle.flexDirection || elementStyle.flexDirection === "auto") {
        elementStyle.flexDirection = "row";
    }
    if (!elementStyle.alignItems || elementStyle.alignItems === "auto") { // alignments?
        elementStyle.alignItems = "stretch";
    }
    if (!elementStyle.justifyContent || elementStyle.justifyContent === "auto") {
        elementStyle.justifyContent = "flex-start"; // items are packed toward the start line
    }
    if (!elementStyle.flexWrap || elementStyle.flexWrap === "auto") {
        elementStyle.flexWrap = "nowrap";
    }
    if (!elementStyle.alignContent || elementStyle.alignContent === "auto") {
        elementStyle.alignContent = "stretch"; //?
    }

    let mainSize,
        mainStart,
        mainEnd,
        mainSign,
        mainBase,
        crossSize,
        crossStart,
        crossEnd,
        crossSign,
        crossBase;

    if (elementStyle.flexDirection === "row") { // from left to right
        mainSize = "width";
        mainStart = "left";
        mainEnd = "right";
        mainSign = +1;
        mainBase = 0;

        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    } else if (elementStyle.flexDirection === "row-reverse") { // from right to left
        mainSize = "width";
        mainStart = "left";
        mainEnd = "right";
        mainSign = -1;
        mainBase = elementStyle.width;

        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    } else if (elementStyle.flexDirection === "column") { // from top to down
        mainSize = "height";
        mainStart = "top";
        mainEnd = "bottom";
        mainSign = +1;
        mainBase = 0;

        crossSize = "width";
        crossStart = "left";
        crossEnd = "right";
    } else if (elementStyle.flexDirection === "column-reverse") { // from bottom to top
        mainSize = "height";
        mainStart = "bottom";
        mainEnd = "top";
        mainSign = -1;
        mainBase = elementStyle.height;

        crossSize = "width";
        crossStart = "left";
        crossEnd = "right";
    }

    if (elementStyle.flexWrap === "wrap-reverse") { // The wrap-reverse value does the opposite
        // - the last item will jump onto the previous line and align over the first item.
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
        // crossBase is left for computing
    } else {
        crossBase = 0;
        crossSign = +1;
    }

    let isAutoMainSize = false;
    if (!elementStyle[mainSize]) { // no size set on the main axis, so we do the auto sizing
        elementStyle[mainSize] = 0;
        for (let item of element.children) {
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] > 0) {
                elementStyle[mainSize] += itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // compute the flexLines  /////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    let flexLine = {
        items: []
    };
    let flexLines = [flexLine];

    let mainSpace = elementStyle[mainSize]; // the remaining space on the main axis
    let crossSpace = 0; //the size on the cross axis

    for (let item of items) {
        let itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            //可伸缩的，是flex；而不是"display": "flex". E.g., flex: 1
            flexLine
                .items
                .push(item);
        } else if (itemStyle.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize]; // if itemStyle[mainSize] is not defined, then the mainSpace isn't changed.
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace]);
            }
            flexLine
                .items
                .push(item);
        } else {
            // wrap
            if (itemStyle[mainSize] > elementStyle[mainSize]) { // 比父元素的size还要大
                itemStyle[mainSize] = elementStyle[mainSize];
            }

            if (mainSpace < itemStyle[mainSize]) { //主轴里的剩余空间不足以存放item
                // set the old flexLine
                flexLine.mainSpace = mainSpace; 
                flexLine.crossSpace = crossSpace;
                flexLine
                    .items
                    .push(item);
                flexLines.push(flexLine);

                // reset flexLine;
                flexLine = {
                    items: []
                };

                // reset  mainSpace and crossSpace for the next flex line
                mainSpace = elementStyle[mainSize];
                crossSpace = 0;
            } else {
                flexLine
                    .items
                    .push(item); //push an item into the flexLine, as the flexLine's mainSpace is greater than 0.
            }

            // update the crossSpace
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace]);
            }

            // update the mainSpace
            mainSpace -= itemStyle[mainSize];
        }
    }
    // update the last flexLine's info
    flexLine.mainSpace = mainSpace;
    if (elementStyle.flexWrap === 'nowrap' || isAutoMainSize) { // 'nowrap' means there's only one flexLine under the element
        flexLine.crossSpace = (elementStyle[crossSize] !== (void 0)) ? elementStyle[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }
    console.log(flexLines);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // compute the main axis  /////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    if (mainSpace < 0){ // if nowrap and the remaining space in the main axis is smaller than 0, we do the scaling
        // overflow (happens only if the container is a single line), scale every item
        let scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace);
        let currentMain = 0; //a cursor to show the start position of the current left remaining space.
        for(let item of items){
            let itemStyle = getStyle(item);

            if(itemStyle.flex){
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale; // reset the mainSize of the item
            itemStyle[mainStart] = currentMain; // add a new property mainStart, which shows the position of the item

            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];  //update the currentMain, as the item occupies a space with the size of itemStyle[mainSize]
        }
    } else {
        // process each flexLine
        flexLines.forEach(function(flexLine){
            let lineMainSpace = flexLine.mainSpace;
            let flexTotal = 0; // it's *NOT* "the number of flex items shown in the flexLine"
                               //, *but* the total sum of flex.
                               //E.g., There are two flex items A and B: A is "flex: 1", and B is "flex: 2",
                               // then the flexTotal is 3.
            let items = flexLine.items;
            for(let item of items){
                let itemStyle = getStyle(item);
                if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))){
                    flexTotal += itemStyle.flex; // flex can be a number that >= 1
                }
            }

            if(flexTotal>0){
                // There are flexible flex items.
                let currentMain = mainBase;
                for(let item of items){
                    let itemStyle = getStyle(item);
                    if(itemStyle.flex){
                        itemStyle[mainSize] = (lineMainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain = (void 0);
                let step = (void 0);
                // There is *NO* flex flex items, which means, justifyContent should work
                if(style.justifyContent === "flex-start"){
                    step = 0;
                    currentMain = mainBase; // leave the lineMainSpace on the right
                }
                if(style.justifyContent === "flex-end"){
                    step = 0;
                    currentMain = mainBase + lineMainSpace * mainSign; // leave the lineMainSpace on the left
                }
                if(style.justifyContent === "center"){
                    step = 0;
                    currentMain = mainBase + lineMainSpace / 2 * mainSign;// leave the lineMainSpace on two ends
                }
                if(style.justifyContent === "space-between"){
                    step = lineMainSpace / (items.length - 1) * mainSign; // leave the lineMainSpace among items
                    currentMain = mainBase + step;
                }
                if(style.justifyContent === "space-around"){
                    step = mainSpace / items.length * mainSign; // leave the lineMainSpace around items
                    currentMain = mainBase + step / 2 ;
                }
                for(let item of items){
                    itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // compute the cross axis /////////////////////////////////////////////////////////////////////////
    // align-items, align-self ////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    if(!elementStyle[crossSize]){ // auto sizing because the crossSize is not defined in the container's style
        crossSpace = 0;
        elementStyle[crossSize] = 0; 
        // use the containers' each inside flexline's crossSpace to update the container's crossSpace.
        for(let flexLine of flexLines){
            elementStyle[crossSize] = elementStyle[crossSize] + flexLine.crossSpace; 
        }
    } else { // the container's crossSize is defined
        crossSpace = elementStyle[crossSize];
        for(let flexLine of flexLines){
            crossSpace -= flexLine.crossSpace;
        }
    }

    if(elementStyle.flexWrap === "wrap-reverse"){
        crossBase = elementStyle[crossSize];
    } else {
        crossBase = 0;
    }
    let lineCrossSize = elementStyle[crossSize] / flexLines.length; //?
    let step; 
    if(elementStyle.alignContent === "flex-start"){
        crossBase += 0; //?
        step = 0;
    }
    if(elementStyle.alignContent === "flex-end"){
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if(elementStyle.alignContent === "center"){
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if(elementStyle.alignContent === "space-between"){
        crossBase = 0;
        step = crossSpace / (flexLines.length -1);
    }
    if(elementStyle.alignContent === "space-around"){
        step = crossSpace / flexLines.length;
        crossBase += crossSign * step / 2;
    }
    if(elementStyle.alignContent === "stretch"){
        crossBase += 0;//?
        step = 0;
    }
    flexLines.forEach(function(flexLine){
        let items = flexLine.items;
        let lineCrossSize = elementStyle.alignContent === "stretch" ?
            flexLine.crossSpace + crossSpace / flexLines.length : 
            flexLine.crossSpace;
        for(let item of items){
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || elementStyle.alignItems; //受alignSelf影响，也受父元素的alignItems的影响

            if(itemStyle[crossSize] === null || itemStyle[crossSize] === (void 0)){ // if height is not defined
                itemStyle[crossSize] = (align === "stretch") ? lineCrossSize : 0; //?
            }
            
            if(align === "flex-start"){
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSpace;
            }
            if(align === "flex-end"){
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossStart] - crossSpace;
            }
            if(align === "center"){
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize])/2;
                itemStyle[crossEnd] = item[crossStart] + crossSign * itemStyle[crossSize];
            }
            if(align === "stretch"){
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * itemStyle[crossSize];
                itemStyle[crossSize] = crossSign * itemStyle[crossSize];
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
}

module.exports = layout;