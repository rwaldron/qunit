asyncTest( "sequence.events", function() {
	expect( 3 );

	var foo = document.getElementById("foo"),
			bar = document.getElementById("bar");


	QUnit.sequence.events([
    function() {
			QUnit.triggerEvent( foo, "click" );
		},

		"click", function( timedOut ) {
			ok( !timedOut, "the event wasn't run as a timeout" );

			QUnit.triggerEvent( bar, "click" );
		},

		"click", function( timedOut ) {
			ok( !timedOut, "the event wasn't run as a timeout" );
		},

		"foo", function( timedOut) {
			ok( timedOut, "the event was never run and the timeout is reported" );
			start();
		}
	]);
});

asyncTest( "sequence.deferred", function() {
	expect( 2 );

	QUnit.sequence.deferred([
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
