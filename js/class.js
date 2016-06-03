'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var centerBlock = function () {
    function centerBlock(props) {
        _classCallCheck(this, centerBlock);

        this.__render(props);
    }

    _createClass(centerBlock, [{
        key: '__render',
        value: function __render(props) {
            window.addEventListener('resize', this.__build(props));
        }
    }, {
        key: '__build',
        value: function __build(props) {
            var blocks = document.querySelectorAll(props.blockIdentifier);
            function builder() {
                var blockWidth = blocks[0].offsetWidth;
                var browserWidth = document.documentElement.clientWidth;
                var count = Math.floor(browserWidth / blockWidth);
                if (count > blocks.length) {
                    count = blocks.length;
                }
                var space = (browserWidth - blockWidth * count) / (count + 1);
                if (browserWidth > blockWidth) {
                    Array.prototype.forEach.call(blocks, function (block) {
                        block.style.marginLeft = space + 'px';
                        block.style.marginRight = space + 'px';
                        if (count > 1) {
                            block.style.marginRight = '';
                        }
                    });
                } else {
                    Array.prototype.forEach.call(blocks, function (block) {
                        block.style.marginLeft = '';
                        block.style.marginRight = '';
                    });
                }
            }
            builder();
            return builder;
        }
    }]);

    return centerBlock;
}();

var MovingBlock = function () {
    function MovingBlock(props) {
        _classCallCheck(this, MovingBlock);

        this.__render(props);
    }

    _createClass(MovingBlock, [{
        key: '__render',
        value: function __render(props) {
            var elem = document.body.querySelector(props.blockIdentifier);
            var footer = document.body.querySelector(props.footerIdentifier);

            if (elem && footer) {
                var tempElem = elem.cloneNode(true);
                tempElem.style.opacity = 0;
                window.addEventListener('scroll', this.__moveBlock(elem, footer, tempElem));
            } else {
                var errorMessage = '';
                if (!elem) {
                    errorMessage += 'Block with identifier - ' + props.blockIdentifier + ' does no exist |';
                }
                if (!footer) {
                    errorMessage += ' Footer with identifier - ' + props.footerIdentifier + ' does no exist';
                }
                console.log(errorMessage);
            }
        }
    }, {
        key: '__moveBlock',
        value: function __moveBlock(elem, footer, tempElem) {

            var blocker = 1;
            var blocks = document.querySelectorAll(".block");
            var elemHeight = elem.offsetHeight;
            var blockProps = {};
            window.addEventListener('resize', this.__resize(footer, blocks, elemHeight, blockProps));
            var firstBlockBottomCoordinate = blocks[0].getBoundingClientRect().bottom + window.pageYOffset;

            var upperBorderline = firstBlockBottomCoordinate - 50;

            var check = function check() {

                if (window.pageYOffset <= upperBorderline) {
                    if (blocker != 1) {
                        elem.style.position = 'static';
                        blocker = 1;
                        if (elem.previousElementSibling == tempElem) {
                            elem.parentNode.removeChild(tempElem);
                        }
                        return;
                    }
                }

                if (window.pageYOffset > upperBorderline && window.pageYOffset < blockProps.lowerBorderline && blocker != 2) {

                    elem.style.position = 'fixed';
                    elem.style.top = '0px';
                    blocker = 2;
                    if (elem.previousElementSibling != tempElem) {
                        elem.parentNode.insertBefore(tempElem, elem);
                    }
                    return;
                }

                if (window.pageYOffset >= blockProps.lowerBorderline && blocker != 3) {

                    elem.style.position = 'absolute';
                    elem.style.top = blockProps.footerTopCoordinate - blockProps.absolutePosition + 'px';
                    blocker = 3;
                    if (elem.previousElementSibling != tempElem) {
                        elem.parentNode.insertBefore(tempElem, elem);
                    }
                }
            };
            check();
            return check;
        }
    }, {
        key: '__resize',
        value: function __resize(footer, blocks, elemHeight, blockProps) {

            function builder() {
                blockProps.footerTopCoordinate = footer.getBoundingClientRect().top + window.pageYOffset; //!
                blockProps.secondBlockBottomCoordinate = blocks[1].getBoundingClientRect().bottom + window.pageYOffset; //!
                blockProps.absolutePosition = elemHeight + (blockProps.footerTopCoordinate - blockProps.secondBlockBottomCoordinate) / 2; //!
                blockProps.lowerBorderline = blockProps.footerTopCoordinate - elemHeight - (blockProps.footerTopCoordinate - blockProps.secondBlockBottomCoordinate) / 2; //!
                console.log(blockProps.footerTopCoordinate, elemHeight, blockProps.footerTopCoordinate, blockProps.secondBlockBottomCoordinate);
            }
            builder();
            return builder;
        }
    }]);

    return MovingBlock;
}();

window.onload = function () {
    new MovingBlock({
        blockIdentifier: '.header',
        blockIndentFromTop: 0,
        footerIdentifier: '.footer'
    });
    new centerBlock({
        blockIdentifier: '.block'
    });
};