asyncTest( "eventCascade", function() {
	expect( 2 );

	function triggerMouseEventOn( id ){
		var event = document.createEvent( "MouseEvent" );
		event.initMouseEvent( "click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.getElementById( id ).dispatchEvent( event );
	}

	QUnit.eventSequence([
		function() {
			triggerMouseEventOn( "foo" );
		},

		"click", function( timedOut ) {
			ok( !timedOut, "the event wasn't run as a timeout" );

			triggerMouseEventOn( "bar" );
		},

		"click", function( timedOut ) {
			ok( !timedOut, "the event wasn't run as a timeout" );

			start();
		}
	]);
});

asyncTest( "deferredSequence", function() {
	expect( 2 );

	QUnit.deferredSequence([
		function() {
			var deferred = jQuery.Deferred();
			deferred.resolve();
			return deferred;
		},

		function() {
			ok( true );
		},

		function() {
			var deferred = jQuery.Deferred();
			deferred.resolve();
			return deferred;
		},

		function() {
			ok( true );
			start();
		}
	]);
});
