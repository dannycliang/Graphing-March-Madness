
  var decimal_places = 1;
  var decimal_factor = 1;

  $('#target').animateNumber(
    {
      number: 100,
      color: 'black',
      'font-size': '30px',

      numberStep: function(now, tween) {
        var floored_number = Math.floor(now) / decimal_factor,
            target = $(tween.elem);
        if (decimal_places > 0) {
          floored_number = floored_number.toFixed(decimal_places);
        }

        target.text(floored_number + ' %');
      }
    },
    3000
  )

 $('#target1').animateNumber(
    {
      number: 86.7,
      color: 'black',
      'font-size': '30px',

      numberStep: function(now, tween) {
        var floored_number = Math.floor(now) / decimal_factor,
            target = $(tween.elem);
        if (decimal_places > 0) {
          floored_number = floored_number.toFixed(decimal_places);
        }

        target.text(floored_number + ' %');
      }
    },
    3000
  )
  
   $('#target2').animateNumber(
    {
      number: 80.2,
      color: 'black',
      'font-size': '30px',

      numberStep: function(now, tween) {
        var floored_number = Math.floor(now) / decimal_factor,
            target = $(tween.elem);
        if (decimal_places > 0) {
          floored_number = floored_number.toFixed(decimal_places);
        }

        target.text(floored_number + ' %');
      }
    },
    3000
  )
   $('#target3').animateNumber(
    {
      number: 58.4,
      color: 'black',
      'font-size': '30px',

      numberStep: function(now, tween) {
        var floored_number = Math.floor(now) / decimal_factor,
            target = $(tween.elem);
        if (decimal_places > 0) {
          floored_number = floored_number.toFixed(decimal_places);
        }

        target.text(floored_number + ' %');
      }
    },
    3000
  )
   $('#target4').animateNumber(
    {
      number: 61.2,
      color: 'black',
      'font-size': '30px',

      numberStep: function(now, tween) {
        var floored_number = Math.floor(now) / decimal_factor,
            target = $(tween.elem);
        if (decimal_places > 0) {
          floored_number = floored_number.toFixed(decimal_places);
        }

        target.text(floored_number + ' %');
      }
    },
    3000
  )
   $('#target').animateNumber(
    {
      number: 59.4,
      color: 'black',
      'font-size': '30px',

      numberStep: function(now, tween) {
        var floored_number = Math.floor(now) / decimal_factor,
            target = $(tween.elem);
        if (decimal_places > 0) {
          floored_number = floored_number.toFixed(decimal_places);
        }

        target.text(floored_number + ' %');
      }
    },
    3000
  )