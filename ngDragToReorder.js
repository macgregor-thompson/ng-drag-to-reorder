(function () {
  'use strict';

  angular.module('ngDragToReorder', [])
    .factory('ngDragToReorder', function () {

      var _list = [];

      return {
        isSupported: draggable,
        setList: setList,
        getList: getList
      };

      function setList(array) {
        if (array && array.length) _list = array;
      }

      function getList() {
        return _list;
      }

      function draggable() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
      }

    })
    .directive('dragToReorder', ['ngDragToReorder', '$parse', function (ngDragToReorder, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

          if (!ngDragToReorder.isSupported()) return;

          ngDragToReorder.setList($parse(attrs.dragToReorder)((scope)));

          var el = element[0], list, stringIdx, int, item,
            newIdx, startIndex, target, offsetY, dragging = 'dtr-dragging', over = 'dtr-over',
            droppingAbove = 'dtr-dropping-above', droppingBelow = 'dtr-dropping-below', transition = 'dtr-transition',
            delay = 1000, loaded = false, above = [],  below = [], i, j;

          //console.log('list:', list);

          if (attrs.hasOwnProperty('dtrInit')) {
            attrs.$observe('dtrInit', function (val) {
              if (val && val !== 'false') {
                addListeners();
              } else if (loaded) {
                removeListeners();
              }
              loaded = true;
            });
          } else {
            addListeners();
          }

          if (attrs.hasOwnProperty('dtrTransitionTimeout')) {
            int = parseInt(attrs.dtrTransitionTimeout, 10);
            delay = int ? int : 1000;
          }


          function addListeners() {
            el.draggable = true;
            el.addEventListener('dragstart', dragStart, false);
            el.addEventListener('dragend', dragEnd, false);
            el.addEventListener('dragenter', dragEnter, false);
            el.addEventListener('dragleave', dragLeave, false);
            el.addEventListener('dragover', dragOver, false);
            el.addEventListener('drop', drop, false);
          }

          function removeListeners() {
            el.draggable = false;
            el.removeEventListener('dragstart', dragStart, false);
            el.removeEventListener('dragend', dragEnd, false);
            el.removeEventListener('dragenter', dragEnter, false);
            el.removeEventListener('dragleave', dragLeave, false);
            el.removeEventListener('dragover', dragOver, false);
            el.removeEventListener('drop', drop, false);
          }

          function drop(e) {
            e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            startIndex = parseInt(e.dataTransfer.getData('text'), 10);
            this.classList.remove(over);
            if (this.classList.contains(droppingAbove)) {
              if (startIndex < scope.$index) {
                newIdx = scope.$index - 1;
              } else {
                newIdx = scope.$index;
              }
            } else {
              if (startIndex < scope.$index) {
                newIdx = scope.$index;
              } else {
                newIdx = scope.$index + 1;
              }
            }

            list = ngDragToReorder.getList();
            item = list.splice(startIndex, 1)[0];
            list.splice(newIdx, 0, item);

            ngDragToReorder.setList(list);

            scope.$apply(function () {
              scope.$emit('dragToReorder_drop', {
                item: item,
                newIndex: newIdx,
                prevIndex: startIndex,
                list: list
              });
            });

            this.classList.remove(over);
            this.classList.remove(droppingAbove);
            this.classList.remove(droppingBelow);
            if (this.previousElementSibling) {
              this.previousElementSibling.classList.remove(over);
              this.previousElementSibling.classList.remove(droppingAbove);
              this.previousElementSibling.classList.remove(droppingBelow);
            }
            if (this.nextElementSibling) {
              this.nextElementSibling.classList.remove(over);
              this.nextElementSibling.classList.remove(droppingAbove);
              this.nextElementSibling.classList.remove(droppingBelow);
            }

          }


          function dragStart(e) {
            e.dataTransfer.effectAllowed = 'move';
            // **IMPORTANT** In order for this to work in IE, 'text' MUST
            // not 'Text', ot 'text/plain' etc...
            // Also the value (idx) needs to be a string
            stringIdx = scope.$index.toString();
            e.dataTransfer.setData('text', stringIdx);
            this.classList.add(dragging);
            this.classList.add(transition);
            return false;
          }

          function dragEnd(e) {
            target = this;
            target.classList.remove(dragging);
            setTimeout(function () {
              target.classList.remove(transition)
            }, delay);
            cleanupClasses();
            return false;
          }


          function dragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            offsetY = e.offsetY;
            if (offsetY < (this.offsetHeight / 2)) {
              this.classList.remove(droppingBelow);
              this.classList.add(droppingAbove);
              if (this.previousElementSibling)
                this.previousElementSibling.classList.add(droppingBelow);
              if (this.nextElementSibling)
                this.nextElementSibling.classList.remove(droppingAbove);
            } else {
              this.classList.remove(droppingAbove);
              this.classList.add(droppingBelow);
              if (this.previousElementSibling)
                this.previousElementSibling.classList.remove(droppingBelow);
              if (this.nextElementSibling)
                this.nextElementSibling.classList.add(droppingAbove);
            }
            return false;
          }

          function dragEnter(e) {
            e.preventDefault();
            if (!this.classList.contains(dragging))
              this.classList.add(over);
          }

          function dragLeave(e) {
            this.classList.remove(over);
            this.classList.remove(droppingAbove);
            this.classList.remove(droppingBelow);
            return false;
          }


          function cleanupClasses () {
            above = document.querySelectorAll('.' + droppingAbove);
            below = document.querySelectorAll('.' + droppingBelow);
            if (above.length) {
              for (i = 0; i < above.length; i++) {
                above[i].classList.remove(droppingAbove);
              }
            }
            if (below.length) {
              for (i = 0; i < below.length; i++) {
                below[i].classList.remove(droppingBelow);
              }
            }
          }

        }
      };

    }]);

})();
