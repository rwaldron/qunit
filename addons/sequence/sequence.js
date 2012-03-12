QUnit.extend( QUnit, {
  sequence: {
    events: function( sequence, timedOut, eventInfo ) {
      var fn = sequence.shift(),
          event = sequence.shift(),
          self = this,
          warnTimer;

      // `
      if ( fn === undefined ) {
        return;
      }
      // if the event isn't defined we've reached the end of the sequence.
      // fire the shifted fn at the bottom to finish the sequence

      if ( event ) {
        // if a pagechange or defined event is never triggered
        // continue in the sequence to alert possible failures
        warnTimer = setTimeout(function() {
          QUnit.sequence.events( sequence, true );
        }, 2000);


        function listener( eventInfo ) {
          clearTimeout( warnTimer );

          // we only want this listener to get fired once so unbind
          document.removeEventListener( event, listener );

          // Let the current stack unwind before we fire off the next item in the sequence.
          // TODO setTimeout(self.pageSequence, 0, sequence);
          setTimeout(function() {
            QUnit.sequence.events( sequence );
          }, 0);
        };

        document.addEventListener( event, listener, false );
      }
      // invoke the function which should either trigger the next event
      // or finish out the sequence if no event was defined
      fn( timedOut );
    },

    deferred: function( fns ) {
      if ( !window.jQuery || !window.jQuery.Deferred ) {
        throw "jQuery and jQuery.Deferred must be defined to use QUnit.sequence.deferred";
      }

      var fn = fns.shift(),
          deferred = window.jQuery.Deferred(),
          resolved;

      if (fn) {

        resolved = fn();

        if ( resolved && jQuery.isFunction(resolved.done) ) {
          resolved.done(function() {
            QUnit.sequence.deferred( fns ).done(function() {
              deferred.resolve();
            });
          });
        } else {
          QUnit.sequence.deferred( fns ).done(function() {
            deferred.resolve();
          });
        }
      } else {
        deferred.resolve();
      }

      return deferred;
    }
  }
});
