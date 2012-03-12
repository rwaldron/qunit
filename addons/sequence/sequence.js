QUnit.extend( QUnit, {
	eventSequence: function( sequence, timedOut, eventInfo ) {
		var fn = sequence.shift(),
			event = sequence.shift(),
			self = this;

		if( event ){
			// if a pagechange or defined event is never triggered
			// continue in the sequence to alert possible failures
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

		// invoke the function which should, in some fashion,
		// trigger the next event
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
