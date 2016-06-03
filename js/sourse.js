'use strict';


class centerBlock {
    constructor(props) {
        this.__render(props)
    }
    __render(props) {
        window.addEventListener('resize', this.__build(props))
    }
    __build(props) {
        let blocks = document.querySelectorAll(props.blockIdentifier);
        function builder() {
            let blockWidth = blocks[0].offsetWidth;
            let browserWidth = document.documentElement.clientWidth
            let count = Math.floor(browserWidth / blockWidth)
            if (count > blocks.length) {
                count = blocks.length
            }
            let space = (browserWidth - (blockWidth * count)) / (count + 1)
            if (browserWidth > blockWidth) {
                Array.prototype.forEach.call(blocks, function (block) {
                    block.style.marginLeft = `${space}px`
                    block.style.marginRight = `${space}px`
                    if (count > 1) {
                        block.style.marginRight = ``
                    }
                })
            }
            else {
                Array.prototype.forEach.call(blocks, function (block) {
                    block.style.marginLeft = ``
                    block.style.marginRight = ``
                })
            }
        }
        builder()
        return builder
    }
}


class MovingBlock {
    constructor(props) {
        this.__render(props)
    }

    __render(props) {
        let elem = document.body.querySelector(props.blockIdentifier)
        let footer = document.body.querySelector(props.footerIdentifier)

        if (elem && footer) {
            let tempElem = elem.cloneNode(true)
            tempElem.style.opacity = 0
            window.addEventListener('scroll', this.__moveBlock(elem, footer, tempElem))
        }
        else {
            let errorMessage = ''
            if (!elem) {
                errorMessage += `Block with identifier - ${props.blockIdentifier} does no exist |`
            }
            if (!footer) {
                errorMessage += ` Footer with identifier - ${props.footerIdentifier} does no exist`
            }
            console.log(errorMessage)
        }
    }

    __moveBlock(elem, footer, tempElem) {

        let blocker = 1
        let blocks = document.querySelectorAll(".block")
        let elemHeight = elem.offsetHeight
        let blockProps = {}
        window.addEventListener('resize', this.__resize(footer, blocks, elemHeight, blockProps))
        let firstBlockBottomCoordinate = blocks[0].getBoundingClientRect().bottom + window.pageYOffset

        let upperBorderline = firstBlockBottomCoordinate - 50

        let check = () => {

            if (window.pageYOffset <= upperBorderline) {
                if (blocker != 1) {
                    elem.style.position = 'static'
                    blocker = 1
                    if (elem.previousElementSibling == tempElem) {
                        elem.parentNode.removeChild(tempElem)
                    }
                    return
                }
            }

            if (window.pageYOffset > upperBorderline && window.pageYOffset < blockProps.lowerBorderline && blocker != 2) {

                elem.style.position = 'fixed'
                elem.style.top = `0px`
                blocker = 2
                if (elem.previousElementSibling != tempElem) {
                    elem.parentNode.insertBefore(tempElem, elem)
                }
                return
            }

            if (window.pageYOffset >= blockProps.lowerBorderline && blocker != 3) {

                elem.style.position = 'absolute'
                elem.style.top = blockProps.footerTopCoordinate - blockProps.absolutePosition + 'px'
                blocker = 3
                if (elem.previousElementSibling != tempElem) {
                    elem.parentNode.insertBefore(tempElem, elem)
                }
            }
        }
        check()
        return check
    }
    __resize(footer, blocks, elemHeight, blockProps) {

        function builder() {
            blockProps.footerTopCoordinate = footer.getBoundingClientRect().top + window.pageYOffset//!
            blockProps.secondBlockBottomCoordinate = blocks[1].getBoundingClientRect().bottom + window.pageYOffset//!
            blockProps.absolutePosition = elemHeight + (blockProps.footerTopCoordinate - blockProps.secondBlockBottomCoordinate) / 2//!
            blockProps.lowerBorderline = blockProps.footerTopCoordinate - elemHeight - (blockProps.footerTopCoordinate - blockProps.secondBlockBottomCoordinate)/2//!
            console.log(blockProps.footerTopCoordinate, elemHeight, blockProps.footerTopCoordinate, blockProps.secondBlockBottomCoordinate)
        }
        builder()
        return builder
    }

}

window.onload = () => {
    new MovingBlock({
        blockIdentifier: '.header',
        blockIndentFromTop: 0,
        footerIdentifier: '.footer'
    });
    new centerBlock({
        blockIdentifier: '.block'
    })
}