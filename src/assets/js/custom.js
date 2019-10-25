$(document).ready(function() {
    var _limit = 6;
    var apiBase = $.HSCore.settings.jobsApi;
    var path = '/jobs'
    var total = 0;
    var _currentPage = 1;
    var _totalRecords = 0;

    var getRecords = function(callback, page = 1, limit = 6) {
        var loadMoreBtn = $('#button-jobs-load');
        if (callback)
            callback();

        // check to see if we are on the last one
        if (_totalRecords > 0 && (page+1) * _limit > _totalRecords)
            loadMoreBtn.hide();

        var params = {
            '_limit': _limit,
            '_page': _currentPage
        };

        var url = apiBase + path + '?' + $.param( params );

        var jqxhr = $.get(url, function(data, textStatus, jqHR) {
            // grab total pages
            _totalRecords = parseInt(jqHR.getResponseHeader('x-total-count'));

            // build results
            for (var i = 0; i < data.length; i++) {
                $('#jobs-section > .container > .row')
                    .append(column(data[i]));
            }

            if (callback)
                callback();
        })
        .fail(function(error) {
            console.log(error)
        })
        .always(function() {
            console.log('loading');
        });
    };

    // toggle button loading
    $('#button-jobs-load').click(function(event) {
        var _self = $(this);
        // disable link on click
        event.preventDefault();
        var toggleLoader = function () {
            _self.find('i').toggleClass('fa-check-circle');
            _self.find('i').toggleClass('fa-refresh');
            _self.find('i').toggleClass('fa-spin');
        };

        getRecords(toggleLoader, _currentPage++, _limit);
    });

    // onload get intial settings
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

    var intro = $('<p />').text(job.description);
   intro.appendTo(article);

    var details = $('<div />').addClass('job-details');
    var attributes = $('<ul />').addClass('list-unstyled g-mt-15');
    var inlineItem = $('<li />').addClass('list-inline-item');

    if (job.isHotFlag) {
        var isHot = $('<a />')
            .addClass('u-tags-v1 g-font-size-12 g-color-blue g-brd-around g-brd-blue g-bg-blue--hover g-color-white--hover rounded g-py-3 g-px-8')
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
        .addClass('u-link-v5 g-font-weight-600 g-color-blue g-color-blue--hover')
        .attr('href', job.url)
        .text('See details');

    details.append(separator);

    footer.append(inlineItem.clone().append(cta))
        .appendTo(details);

    details.appendTo(article);

    // build
    return column;
}