// External js: jquery, isotope.pkgd.js, bootstrap.min.js, bootstrap-slider.js
$(document).ready( function() {

  // Create object to store filter for each group
  var buttonFilters = {};
  var buttonFilter = '*';
  // Create new object for the range filters and set default values,
  // The default values should correspond to the default values from the slider
  var rangeFilters = {
      'height': {'min':150, 'max': 185},
      'weight': {'min':50, 'max': 90}
    };

  // Initialise Isotope
  // Set the item selector
  var $grid = $('.grid').isotope({
    itemSelector: '.item',
    layout: 'masonry',
    // use filter function
    filter: function() {
      var $this = $(this);
      var height = $this.attr('data-height');
      var weight = $this.attr('data-weight');
      var isInHeightRange = (rangeFilters['height'].min <= height && rangeFilters['height'].max >= height);
      var isInWeightRange = (rangeFilters['weight'].min <= weight && rangeFilters['weight'].max >= weight);
      //console.log(rangeFilters['height']);
      //console.log(rangeFilters['weight']);
      // Debug to check whether an item is within the height weight range
      //console.log('isInHeightRange:' +isInHeightRange + '\nisInWeightRange: ' + isInWeightRange );
      return $this.is( buttonFilter ) && (isInHeightRange && isInWeightRange);
    }
  });


  // Initialise Sliders
  // Set min/max range on sliders as well as default values
  var $heightSlider = $('#filter-height').slider({ tooltip_split: true, min: 130,  max: 220, range: true, value: [150, 180] });
  var $weightSlider = $('#filter-weight').slider({ tooltip_split: true, min: 40,  max: 150, range: true, value: [50, 90] });


  function updateRangeSlider(slider, slideEvt) {
    console.log('Current slider:' + slider);
    var sldmin = +slideEvt.value[0],
        sldmax = +slideEvt.value[1],
        // Find which filter group this slider is in (in this case it will be either height or weight)
        // This can be changed by modifying the data-filter-group="age" attribute on the slider HTML
        filterGroup = slider.attr('data-filter-group'),
        // Set current selection in variable that can be pass to the label
        currentSelection = sldmin + ' - ' + sldmax;

      // Update filter label with new range selection
      slider.siblings('.filter-label').find('.filter-selection').text(currentSelection);

      // Set min and max values for current selection to current selection
      // If no values are found set min to 0 and max to 100000
      // Store min/max values in rangeFilters array in the relevant filter group
      // E.g. rangeFilters['height'].min and rangeFilters['height'].max
      console.log('Filtergroup: '+ filterGroup);
      rangeFilters[filterGroup] = {
        min: sldmin || 0,
        max: sldmax || 100000
      };
      // Trigger isotope again to refresh layout
      $grid.isotope();

  }

  // Trigger Isotope Filter when slider drag has stopped
  $heightSlider.on('slideStop', function(slideEvt){
    var $this =$(this);
    updateRangeSlider($this, slideEvt);
  });
  $weightSlider.on('slideStop', function(slideEvt){
    var $this =$(this);
    updateRangeSlider($this, slideEvt);
  });


  // Look inside element with .filters class for any clicks on elements with .btn
  $('.filters').on( 'click', '.btn', function() {
    var $this = $(this);
    // Get group key from parent btn-group (e.g. data-filter-group="color")
    var $buttonGroup = $this.parents('.btn-group');
    var filterGroup = $buttonGroup.attr('data-filter-group');
    // set filter for group
    buttonFilters[ filterGroup ] = $this.attr('data-filter');
    // Combine filters or set the value to * if buttonFilters
    buttonFilter = concatValues( buttonFilters ) || '*';
    // Log out current filter to check that it's working when clicked
    console.log( buttonFilter )
    // Trigger isotope again to refresh layout
    $grid.isotope();
  });


  // change is-checked class on btn-filter to toggle which one is active
  $('.btn-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', '.btn-filter', function() {
          $buttonGroup.find('.is-checked').removeClass('is-checked');
          $(this).addClass('is-checked');
      });
  });

});

// Flatten object by concatting values
function concatValues( obj ) {
  var value = '';
  for ( var prop in obj ) {
    value += obj[ prop ];
  }
  return value;
}
