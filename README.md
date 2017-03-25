# ng-drag-to-reorder

Lightweight AngularJS drag and drop functionality to reorder lists without any dependencies other than Angular. Works great with ng-repeats!

## Demos: 

- [`Simple List`](http://htmlpreview.github.io/?https://github.com/mhthompson86/ng-drag-to-reorder/blob/master/demo/index.html)

## Install:

```shell
$ npm install ng-drag-to-reorder
```
or
```shell
$ bower install ng-drag-to-reorder
```

## Inject into your Angular app

- Add `ngDragToReorder` as a dependency to your module in your application.

```js
angular.module('yourApp', ['ngDragToReorder']);
```

## How to Use:

- For the most basic usage just add the `drag-to-reorder` attribute to your list items and pass it the list.
```html
<ul>
  <li ng-repeat="avenger in $ctrl.avengers" drag-to-reorder="$ctrl.avengers">
    <span ng-bind="avenger.rank"></span>
    <span ng-bind="avenger.name"></span>
  </li>
</ul>
```

- When you drop an item, the `dragToReorder_drop` event is broadcasted and will contain the relevant data, allowing your controllers to know when the list has been reordered and react to the changes.
- In your controller, you can listen for the event with something similar to below:
```js
$scope.$on('dragToReorder_drop', function (evt, data) {   
    
  // The dragged item
  data.item
  
  // The new index number for the dragged item
  data.newIndex
  
  // The previous index number for the dragged item
  data.prevIndex
  
  // The list after it has been reordered
  data.list
});
```

## CSS Classes:

When you start dragging the element, different classes are added to the element being dragged as well as the elements you are dragging over. 
(All classes are added to the elements containing the `drag-to-reorder` attribute)


- `dtr-dragging` is added to the element that is being dragged when you start to drag it.
- `dtr-over` is added to the element you are hovering over.
- `dtr-dropping-above` is added to the element if you are hovering **above** the the middle point of the element. ***
- `dtr-dropping-below` is added to the element if you are hovering **below** the the middle point of the element. ***
- `dtr-transition` is added to the dragged element when you start to drag it, but is removed on a delay after being dropped. 
This default delay is 1 second (1000 ms), but can be designated by using the `dtr-transition-timeout` attribute (see **Options** below).


*** **Important:**  The class `dtr-dropping-above` or `dtr-dropping-below` will also be added to the previous or next sibling element of the one you are hovering over. 
Depending on which class the element you are hovering over has will determine which sibling will have a class added. (See example below...)

**E.g.**  If you have Elements 1-10.  And you begin dragging Element 1.  Element 1 will have the `dtr-dragging` and `dtr-transition` classes added to it.
Let's say you drag Element 1 and are hovering over Element 5. Element 5 will have the `dtr-over` class and either the `dtr-dropping-above` class if the mouse is above the
halfway point (offsetY) or `dtr-dropping-below` if below it.  If above it, the previous sibling above (Element 4) will have the `dtr-dropping-below` class added to it. 
If below the halfway point, the next sibling below (Element 6) will have the `dtr-dropping-above` class added to it. 
After you drop Element 1, the `dtr-dragging` is removed immediately, followed by the `dtr-transition` class 1 second later or after the number of milliseconds passed
in via the `dtr-transition-timeout` attribute (see **Options** below). This allows for more flexibility in how you want to style the elements during the drag and drop process. 


## Options:

1. `dtr-init` allows you turn the drag and drop functionality on and off. You can pass it an expression to observe and will add or remove the event listeners based on a true/false value.

```html
<!-- In your template (example) -->
<ul>
  <li ng-repeat="avenger in $ctrl.avengers" drag-to-reorder="$ctrl.avengers" dtr-nit="{{$ctrl.draggable}}">
    <span ng-bind="avenger.rank"></span>
    <span ng-bind="avenger.name"></span>
  </li>
</ul>
<button ng-click="$ctrl.toggleDrag()">Toggle Drag and Drop</button>
```

```javascript
  // In your controller (example)
  
  //prevent the list from being draggable on load
  this.draggable = false;
  
  //toggle drag and drop
  this.toggleDrag = () => this.draggable = !this.draggable;
```

2. `dtr-transition-timeout` allows you to set the timeout period (in milliseconds) for when the `dtr-transition` class is removed from the dragged element. 
This is just an available option in case you want to add some custom animation.

```html
<!-- In your template (example) -->
<ul>
  <li ng-repeat="avenger in $ctrl.avengers" drag-to-reorder="$ctrl.avengers"  dtr-transition-timeout="5000">
    <span ng-bind="avenger.rank"></span>
    <span ng-bind="avenger.name"></span>
  </li>
</ul>
```


3. You can import the **ngDragToReorder** service into your controller and check to see if drag and drop functionality is supported by your 
browser. The `drag-to-reorder` directive uses this service to prevent itself from wiring up event listeners if the browser doesn't support 
it. You can use the same service if you want to show or hide and buttons or other UI based on browser support.  

```html
<!-- In your template (example) -->
<ul>
  <li ng-repeat="avenger in $ctrl.avengers" drag-to-reorder="$ctrl.avengers" dtr-nit="{{$ctrl.draggable}}">
    <span ng-bind="avenger.rank"></span>
    <span ng-bind="avenger.name"></span>
  </li>
</ul>
<button ng-if="$ctrl.isSupported" ng-click="$ctrl.toggleDrag()">Toggle Drag and Drop</button>
```

```javascript
 /* @ngInject */
  function exampleComponentController(ngDragToReorder, $scope) {
      //check to see if the browser supports drag and drop
    this.isSupported = ngDragToReorder.isSupported();
    
    //prevent the list from being draggable on load
    this.draggable = false;
    
    //toggle drag and drop
    this.toggleDrag = () => this.draggable = !this.draggable;
  }
```
