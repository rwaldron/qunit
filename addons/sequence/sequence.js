QUnit.extend( QUnit, {
	// TODO would be nice to use jquery events where possible
	//      and to forward the even object for testing if possible
	eventSequence: function( sequence, timedOut, eventInfo ) {
		var fn = sequence.shift(),
			event = sequence.shift(),
			self = this;

		// if the event isn't defined we've reached the end of the sequence.
		// fire the shifted fn at the bottom to finish the sequence
		if( event ){
			// if the event is never triggered continue in the sequence
			// to alert the user to possible failures
			var warnTimer = setTimeout(function() {
				self.eventSequence( sequence, true );
			}, 2000);


			function listener( eventInfo ) {
				clearTimeout( warnTimer );

				// we only want this listener to get fired once so unbind
				document.removeEventListener( event, listener );

				// Let the current stack unwind before we fire off the next item in the sequence.
				// TODO setTimeout(self.pageSequence, 0, sequence);
				setTimeout(function(){ self.eventSequence(sequence); }, 0);
			};

			// bind the recursive call to the event
			document.addEventListener(event, listener);
		}

		// invoke the function which should either trigger the next event
		// or finish out the sequence if no event was defined
		fn( timedOut );
	},

	deferredSequence: function(fns) {
		if( !window.jQuery || !window.jQuery.Deferred ){
			throw "jQuery and jQuery.Deferred must be defined to use deferredSequence";
		}

		var fn = fns.shift(),
			deferred = window.jQuery.Deferred(),
			self = this, res;

		if (fn) {
			res = fn();
			if ( res && $.type( res.done ) === "function" ) {
				res.done(function() {
					self.deferredSequence( fns ).done(function() {
						deferred.resolve();
					});
				});
			} else {
				self.deferredSequence( fns ).done(function() {
					deferred.resolve();
				});
			}
		} else {
			deferred.resolve();
		}

		return deferred;
	}
});
