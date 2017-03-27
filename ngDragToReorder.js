(function () {
  'use strict';

  angular.module('ngDragToReorder', [])
    .factory('ngDragToReorder', function () {
      return {
        isSupported: function () {
          var div = document.createElement('div');
          return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
        }
      };
    })
    .directive('dragToReorder', function () {
      return {
        restrict: 'A',
        scope: true,
        controller: ['$parse', '$attrs', '$scope', function ($parse, $attrs, $scope) {
          this.getList = function() {
            //return a shallow copy and prevents the updating of the parent object
            return $parse($attrs.dragToReorder)($scope).slice();
          };
        }],
      }
    })
    .directive('dragToReorderBind', function () {
      return {
        restrict: 'A',
        scope: true,
        controller: ['$parse', '$attrs', '$scope', function ($parse, $attrs, $scope) {
          this.getList = function() {
            return $parse($attrs.dragToReorderBind)($scope);
          };
        }],
      }
    })
    .directive('dtrDraggable', ['ngDragToReorder', '$parse', function (ngDragToReorder, $parse) {
      return {
        restrict: 'A',
        require: ['?^^dragToReorder', '?^^dragToReorderBind'],
        link: function (scope, element, attrs, ctrls) {

          if (!ngDragToReorder.isSupported()) return;

          var el = element[0], list, stringIdx, int, item, listGetter = ctrls[0] ? ctrls[0] : ctrls[1],
            newIdx, prevIdx, target, offsetY, dragging = 'dtr-dragging', over = 'dtr-over',
            droppingAbove = 'dtr-dropping-above', droppingBelow = 'dtr-dropping-below', transition = 'dtr-transition',
            eventName = 'dropped', delay = 1000, loaded = false, above = [], below = [], i, j;


          if (attrs.dtrEvent) {
            eventName = attrs.dtrEvent || 'dropped';
          }

          if (attrs.dtrInit) {
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
            prevIdx = parseInt(e.dataTransfer.getData('text'), 10);
            this.classList.remove(over);
            if (this.classList.contains(droppingAbove)) {
              if (prevIdx < scope.$index) {
                newIdx = scope.$index - 1;
              } else {
                newIdx = scope.$index;
              }
            } else {
              if (prevIdx < scope.$index) {
                newIdx = scope.$index;
              } else {
                newIdx = scope.$index + 1;
              }
            }

            list = listGetter.getList();
            item = list.splice(prevIdx, 1)[0];
            list.splice(newIdx, 0, item);

            scope.$apply(function () {
              scope.$emit('dragToReorder.' + eventName, {
                list: list,
                item: item,
                newIndex: newIdx,
                prevIndex: prevIdx
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
            stringIdx = scope.$index.toString();
            e.dataTransfer.setData('text', stringIdx);
            this.classList.add(dragging);
            this.classList.add(transition);
            return false;
          }

          function dragEnd(e) {
            target = this;
            target.classList.remove(dragging);
            if (attrs.dtrTransitionTimeout) {
              int = parseInt($parse(attrs.dtrTransitionTimeout)(scope), 10);
              if (typeof int === 'number' && int >= 0)
                delay = int;
            }
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

          function cleanupClasses() {
            above = document.querySelectorAll('.' + droppingAbove);
            below = document.querySelectorAll('.' + droppingBelow);
            if (above.length) {
              for (i = 0; i < above.length; i++) {
                above[i].classList.remove(droppingAbove);
              }
            }
            if (below.length) {
              for (j = 0; j < below.length; j++) {
                below[j].classList.remove(droppingBelow);
              }
            }
          }

        }
      };

    }]);

})();
