jNotify = {
    /*
        Simple event manager object to handle custom events, used to allow
        decoupling of individual components of a website, so that features may be
        implemented independantly, but can interact when needed.

        Usage:
            // Add Listener
            jNotify.add_listener('eventname', callback [, label])

            // Remove Listener (if a label was provided when the listener was added)
            jNotify.remove_listener('eventname', label)

            // signal events
            jNotify.signal('eventname', dataobject)
    */
    'debug': false,
    'events': {idx: [], events: []},
    'add_listener': function (listen_for, listener, listener_label) {
        var event_idx = this.events.idx.indexOf(listen_for);
        if (event_idx === -1) {
            // add a new event to hold listeners
            event_idx = this.events.idx.length;
            this.events.idx.push(listen_for);
            this.events.events[event_idx] = {
                idx: [],
                listeners: []
            }
        }

        if (listener_label == undefined) {
            /*
                Generate a generic id to use as the listener_label (will mean it
                cannot be easily removed later, if your listener needs to be
                removed in some instances, pass a label as the 3rd argument.

                This also means we cannot filter multiple appends to event listeners.

                Code for UUID generation originally from: 
                http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
            */
            listener_label = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        if (this.debug && window.console && console.log) {
            console.log('Adding event listener for `' + listen_for + '` at label `' + listener_label + '`');
        }

        if (this.events.events[event_idx].idx.indexOf(listener_label) === -1) {
            this.events.events[event_idx].idx.push(listener_label);
            this.events.events[event_idx].listeners.push(listener);
        }
        return listener_label;
    },
    'remove_listener': function (listen_for, listener_label) {
        var event_idx = this.events.idx.indexOf(listen_for);

        if (this.debug && window.console && console.log) {
            console.log('Removing event listener for `' + listen_for + '` at label `' + listener_label + '`');
        }

        if (this.events.events[event_idx] && this.events.events[event_idx].idx.indexOf(listener_label) !== -1) {
            var idx = this.events.events[event_idx].idx.indexOf(listener_label);

            this.events.events[event_idx].idx.splice(idx, 1);
            this.events.events[event_idx].listeners.splice(idx, 1);
            return true;
        }
        return false;
    },
    'signal': function (triggered, data) {
        var event_idx = this.events.idx.indexOf(triggered);
        var context = {
            'event': triggered,
            'data': data
        }
        if (this.debug && window.console && console.log) {
            console.log('Triggering event `' + triggered + '` data:');
            console.log(data);
        }

        if (event_idx !== -1 && this.events.events[event_idx].listeners.length) {
            /*
                Creates a context object, so that each listener can reference the
                event data via this.event and this.data.
            */
            for (var i=0, len=this.events.events[event_idx].listeners.length; i<len; ++i) {
                context.method = this.events.events[event_idx].listeners[i];
                context.method();
            }
        }
        return context.data;
    }
}
