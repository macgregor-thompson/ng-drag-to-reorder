(function () {
  'use strict';

  angular.module('Demo')
    .component('classNames', {
      template: `
<div class="row">
      <div class="col-md-6">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h4 class="panel-title">
              CSS Classes 
              <span class="pull-right">(Drag to see class names)</span>
            </h4>
          </div>
          <div class="panel-body">
            <ul class="list-group" drag-to-reorder-bind="$ctrl.numbers">
              <li class="list-group-item number" ng-repeat="num in $ctrl.numbers"
              dtr-draggable dtr-event="myEvent" dtr-transition-timeout="$ctrl.transitionTimeout">
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
      </div>
      <div class="col-md-6">
          <div class="alert alert-info">
            <p>
              <strong><i class="glyphicon glyphicon-info-sign"></i></strong>
              When you drag an item, you will be able to see when each css class is added and them removed.
            </p>
            <hr>
            <p>
              <strong>Transition Timeout</strong> -
              allows you to set the timeout period (in milliseconds) for when the <strong>.dtr-transition</strong> 
              class is removed from the dragged element. 
              Change the time below and then reorder the list to the left to see the effect.
            </p>
            <input style="margin: 10px 0" type="text" id="transition" ng-model="$ctrl.transitionTimeout" class="form-control">
<pre>
<code>
&lt;ul drag-to-reorder="$ctrl.numbers"&gt;
  &lt;li ng-repeat="num in numbers" 
    dtr-draggable
    dtr-transition-timeout="5000"&gt;
    &lt;span ng-bind="num"&gt;&lt;/span&gt;
  &lt;/li&gt;
&lt;/ul&gt;
</code>
</pre>
          </div>
          <hr>
  <h3>Other Demos</h3>
  <ul class="list-unstyled">
    <li>
      <a href="http://htmlpreview.github.io/?https://github.com/mhthompson86/ng-drag-to-reorder/blob/master/demo/index.html">
        <i class="glyphicon glyphicon-link"></i>
        Avengers Lise
      </a>
    </li>
  </ul>
        </div>
      </div>   
        
            `,
      controller: classNamesController
    });

  /* @ngInject */
  function classNamesController(ngDragToReorder) {
    this.isSupported = ngDragToReorder.isSupported();

    this.transitionTimeout = 1000;

    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.input = '';

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
