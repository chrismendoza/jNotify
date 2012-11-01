jNotify
========

A simple javascript event manager.

```javascript
/*
    Add a new listener, returns the label assigned to the callback.  This may
    not seem very useful if you actually assigned a label.  But in cases where
    the user did not assign a label, a label is automatically generated.

    That label can then be used to remove the listener at a later time if
    necessary.
*/
assigned_label = jNotify.add_listener('eventname', callback, 'test_label');

/*
    Remove Listener, returns true if the listener was found (and as a result
    removed, false if the listener could not be located for that event.
*/
jNotify.remove_listener('eventname', label);

/*
    Signal events, returns the dataobject with any modifications that might 
    have been made by the listeners.
*/
dataobject = jNotify.signal('eventname', dataobject)
```

When a function receives a signal, it gets no arguments, instead, the triggered
event and the data being passed can be accessed via `this.event` and `this.data`
within the listener:

```javascript
function callback() {
    if (this.event == 'testevent') {
        this.data.drink = 'coffee';
    }
}

jNotify.add_listener('testevent', callback);

var dataobject = {};
jNotify.signal('testevent', dataobject);

// dataobject.drink now contains 'coffee'
```