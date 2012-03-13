(function() {
  var counter = 0;

  function Sequence( sequence ) {
    // Allow non-new calls to constructor
    if ( !(this instanceof Sequence) ) {
      return new Sequence( seq );
    }

    var eventType;

    this.queue = sequence;

    // If no initial trigger was provided, create one that
    // triggers an event of the type specified at
    // the first index in initial queue
    if ( typeof this.queue[ 0 ] !== "function" ) {
      // `eventType` initialized at top of scope
      eventType = this.queue[ 0 ];

      this.queue.unshift(function() {
        QUnit.triggerEvent( document.body, eventType );
      });
    }

    // Start the sequence
    this.next();
  }

  Sequence.prototype.next = function( timedOut, event ) {
    // when `timedOut` is undefined/null,
    // assume it's simply not "timed out"
    timedOut = timedOut == null ? false : timedOut;
    event = event || null;

    var fn = this.queue.shift(),
        eventType = this.queue.shift(),
        self = this,
        warnTimer;

    if ( fn === undefined ) {
      return;
    }

    // if the eventType isn't defined we've reached the end of the sequence.
    // fire the shifted fn at the bottom to finish the sequence
    if ( eventType ) {
      // if a pagechange or defined eventType is never triggered
      // continue in the sequence to alert possible failures
      warnTimer = setTimeout(function() {
        self.next( true, null );
      }, QUnit.config.timeout || 2000 );


      function listener( event ) {
        clearTimeout( warnTimer );

        // we only want this listener to get fired once so unbind
        QUnit.removeEvent( document, eventType, listener );

        // Let the current stack unwind before we fire off the next item in the sequence.
        setTimeout(function() {
          self.next( false, event );
        }, 0 );
      };

      // Attach listener for the next event in the sequence
      QUnit.addEvent( document, eventType, listener );
    }

    // Invoke the function which should either trigger the next event
    // or finish out the sequence if no event was defined
    fn( timedOut, event );
  };

  QUnit.extend( QUnit, {
    sequence: {
      events: function( sequence ) {
        return new Sequence( sequence );
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
})();
