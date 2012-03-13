asyncTest( "sequence.events, leading trigger", function() {
	expect( 7 );

	var foo = document.getElementById("foo"),
			bar = document.getElementById("bar"),
      sequence;


	sequence = QUnit.sequence.events([

    // Include the leading trigger
    function() {
    	QUnit.triggerEvent( foo, "click" );
    },

		"click", function( timedOut, event ) {

			ok( !timedOut, "the event was run, did not time out" );
      equal( event.type, "click", "event.type matches expected type" );

      // Trigger next event in the queue
			QUnit.triggerEvent( bar, "click" );
		},

		"click", function( timedOut, event ) {

			ok( !timedOut, "the event wasn't run as a timeout" );
      equal( event.type, "click", "event.type matches expected type" );

      // Do not trigger an event, this should cause a
      // timeout for the next event in the queue.
		},

		"foo", function( timedOut, event ) {

			ok( timedOut, "the event was never run, it timed out" );
      equal( event, null, "event object is null" );
      equal( sequence.queue.length, 0, "There are no items in the sequence queue" );

			start();
		}
	]);
});

asyncTest( "sequence.events, no leading trigger", function() {
  expect( 7 );

  var foo = document.getElementById("foo"),
      bar = document.getElementById("bar"),
      sequence;


  sequence = QUnit.sequence.events([
    // Omit the leading trigger
    // function() {
    //  QUnit.triggerEvent( foo, "click" );
    // },

    "click", function( timedOut, event ) {

      ok( !timedOut, "the event was run, did not time out" );
      equal( event.type, "click", "event.type matches expected type" );

      // Trigger next event in the queue
      QUnit.triggerEvent( bar, "click" );
    },

    "click", function( timedOut, event ) {

      ok( !timedOut, "the event wasn't run as a timeout" );
      equal( event.type, "click", "event.type matches expected type" );

      // Do not trigger an event, this should cause a
      // timeout for the next event in the queue.
    },

    "foo", function( timedOut, event ) {

      ok( timedOut, "the event was never run, it timed out" );
      equal( event, null, "event object is null" );
      equal( sequence.queue.length, 0, "There are no items in the sequence queue" );

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
