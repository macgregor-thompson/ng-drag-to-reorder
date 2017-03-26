(function () {
  'use strict';

  angular.module('Demo')
    .component('classNames', {
      template: `
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h4 class="panel-title">
              CSS Classes 
              <span class="pull-right">(Drag to see classes)</span>
            </h4>
          </div>
          <div class="panel-body">
            <ul class="list-group" drag-to-reorder="$ctrl.numbers">
              <li class="list-group-item number" ng-repeat="num in $ctrl.numbers"
              dtr-draggable dtr-event="myEvent">
                <strong>{{num}}</strong>
               <span class="dragging label label-primary">.dtr-dragging</span>
               <span class="over label label-danger">.dtr-over</span>
               <span class="above label label-success">.dtr-dropping-above</span>
               <span class="below label label-info">.dtr-dropping-below</span>
               <span class="transition label label-warning">.dtr.transition</span>
              </li>
            </ul>
          </div>
          <div class="panel-footer">
            <div class="input-group">
              <input type="text" ng-model="$ctrl.input" class="form-control" placeholder="Add number (or whatever lol)..." ng-keyup="$ctrl.keyup($event)">
              <span class="input-group-btn">
                <button class="btn btn-primary" type="button" ng-click="$ctrl.add()">Add</button>
              </span>
            </div>
          </div>
        </div>
            `,
      controller: classNamesController
    });

  /* @ngInject */
  function classNamesController(ngDragToReorder, $scope) {
    this.isSupported = ngDragToReorder.isSupported();

    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.input = '';

    $scope.$on('dragToReorder.myEvent', (e, data) => {
      console.log('dragToReorder.myEvent');
      this.numbers = data.list;
    });

    this.keyup = e => {
      if (e.keyCode === 13) this.add();
    };

    this.add = () => {
      if (this.input) {
        this.numbers.push(this.input);
        this.input = '';
      }
    }

  }
})();
