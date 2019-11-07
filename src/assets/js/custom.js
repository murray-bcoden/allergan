$(document).ready(function() {
    var _limit = 6;
    var apiBase = $.HSCore.settings.jobsApi;
    var path = '/jobs'
    var total = 0;
    var _currentPage = 1;
    var _totalRecords = 0;
    var _filters = {}

    // utilities
    function extendObject(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }

    var toggleLoader = function () {
        $('#button-jobs-load').find('i').toggleClass('fa-check-circle');
        $('#button-jobs-load').find('i').toggleClass('fa-refresh');
        $('#button-jobs-load').find('i').toggleClass('fa-spin');
    };

    var getRecords = function(callback, page, limit, filters) {
        if (page === undefined)
            page = 1;
        if (limit === undefined)
            limit= 6;

        var loadMoreBtn = $('#button-jobs-load');

        if (callback)
            callback();

        var params = {
            '_limit': limit,
            '_page': page
        };

        // check for filters
        if ( filters )
            params = extendObject(params, filters);

        var url = apiBase + path + '?' + $.param( params );

        var jqxhr = $.get(url, function(data, textStatus, jqHR) {
            // grab total pages
            _totalRecords = parseInt(jqHR.getResponseHeader('x-total-count'));

            // check to see if we are on the last one
            if (_totalRecords < 1 || _totalRecords > 0 && (page * _limit) > _totalRecords) {
                loadMoreBtn.hide();
            } else {
                loadMoreBtn.show();
            }

            if (page < 2)
                $('#jobs-section > .container > .row').empty();

            for (var i = 0; i < data.length; i++) {
                $('#jobs-section > .container > .row')
                    .append(column(data[i]));
            }

            // toggle loader
            if (callback)
                callback();
        })
        .fail(function(error) {
            // reset loader
            if (callback)
                callback();

            $('#jobs-section > .container > .row')
                .append('<div class="g-color-lightred" style="margin: 0 auto">Failed to get results, please refresh the page to try again.</div>');
            loadMoreBtn.hide();
            $('#jobs-section p').hide();
            $('a[data-filter]').hide();

        })
        .always(function() {
            console.log('loading');
        });
    };

    // toggle button loading
    $('#button-jobs-load').click(function(event) {
        // disable link on click
        event.preventDefault();

        // get current records
        getRecords(toggleLoader, ++_currentPage, _limit, _filters);
    });

    // filtering logic
    $('a[data-filter]').click(function(event) {

        // get the filter and add to the results page
        var _self = $(this);

        // disable link on click
        event.preventDefault();

        // set up filters
        var filter = _self.attr('data-filter').split('=');

        if (filter[0] === 'clear') {
            $('a[data-filter]').removeClass('g-blue-active');
            _filters = {}
        } else if (filter[0] === 'category') {

            // clear previous
            var previous = _filters[filter[0]];
            $('a[data-filter^="clear"]').removeClass('g-blue-active');
            $('a[data-filter^="category"]').not(_self).removeClass('g-blue-active');

            if (previous === filter[1]) {
                delete _filters[filter[0]];
            } else {
                _filters[filter[0]] = filter[1];
            }

        } else if ( ! _filters.hasOwnProperty(filter[0]) ) {
            _filters[filter[0]] = filter[1];
        } else {
            delete _filters[filter[0]];
        }

        _currentPage = 1;
        // filter records, always start at 1
        getRecords(toggleLoader, _currentPage, _limit, _filters);

        // toggle active
        _self.toggleClass('g-blue-active');
    });

    // onload get initial settings
    getRecords();
});

var column = function(job) {
    var column = $('<div />').addClass('col-lg-4 g-mb-30');
    var article = $('<article />').addClass('job-panel rounded g-pa-25 g-bg-white g-brd-around g-brd-gray-light-v4');

    column.append(article);

    var header = $('<h2 />').addClass('h4 g-mb-15');
    var headerLink = $('<a />')
        .addClass('u-link-v5 g-font-weight-600 g-color-blue g-color-blue--hover')
        .attr('href', job.url)
        .text(job.title);

    headerLink.appendTo(header).appendTo(article);

    var intro = $('<p />').html(job.description);
   intro.appendTo(article);

    var details = $('<div />').addClass('job-details');
    var attributes = $('<ul />').addClass('list-unstyled g-mt-15');
    var inlineItem = $('<li />').addClass('list-inline-item');

    if (job.isHotFlag) {
        var isHot = $('<a />')
            .addClass('u-tags-v1 g-font-size-12 g-color-orange g-brd-around g-brd-orange g-bg-orange--hover g-color-white--hover rounded g-py-3 g-px-8')
            .text('Hot');
        attributes.append(inlineItem.clone().append(isHot));
    }

    if (job.isNewFlag) {
        var isNew = $('<a />')
            .addClass('u-tags-v1 g-font-size-12 g-color-green g-brd-around g-brd-green g-bg-green--hover g-color-white--hover rounded g-py-3 g-px-8')
            .text('New');
        attributes.append(inlineItem.clone().append(isNew));
    }

    var category = $('<a />')
        .addClass('u-tags-v1 g-font-size-12 g-color-blue g-brd-around g-brd-blue g-bg-blue--hover g-color-white--hover rounded g-py-3 g-px-8')
        .text(job.category);

    attributes.append(inlineItem.clone().append(category))
        .appendTo(details);

    var separator = $('<hr />').addClass('class="g-brd-gray-light-v4 g-mt-20 g-mb-15"');
    var footer = $('<ul />').addClass('list-inline d-flex justify-content-between g-mb-0');
    var cta =  $('<a />')
        .addClass('btn u-btn-blue u-btn-hover-v2-1 g-font-weight-600 g-color-blue')
        .attr('href', job.url)
        .text('See details');

    details.append(separator);

    footer.append(inlineItem.clone().append(cta))
        .appendTo(details);

    details.appendTo(article);

    // build
    return column;
}