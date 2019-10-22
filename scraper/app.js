const fs = require('fs')
const { promisify } = require('util')
const rp = require('request-promise')
const $ = require('cheerio')
const url = 'https://agn.referrals.selectminds.com/jobs/search/4620880'

const webhook_url = 'https://hooks.slack.com/services/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'
const slack = require('slack-notify')(webhook_url);

const log = function (error) {
    slack.alert(error)
    const log = 'error.log'
    fs.writeFile(log, error)
}

// throws error
const saveFile = function (html, filename) {
    const fd = fs.openSync(filename, 'w+')
    fs.writeSync(fd, html, function(err) {
        if (err) throw err
        console.log(err)
    });
}

// get jobs
const jobs = function (html, results) {
    const listingSelector = '#job_results_list_hldr > .job_list_row'
    const jobs = $(listingSelector, html)

    // data
    const link = '.job_link'
    const category = '.category'
    const description = '.jlr_description'

    for (let i=0; i < jobs.children().length; i++) {
        //
        const parseLines = (text) => {
            return text.replace(/\n\s+/gm, '').trim()
        }

        // link text
        linkUrl = $(link, jobs.children()[i]).attr('href')
        linkText = parseLines($(link, jobs.children()[i]).html())

        // grab
        categoryText = $(category, jobs.children()[i]).html().trim()

        // description
        descriptionText = parseLines($(description, jobs.children()[i]).html()).replace('Job Description:', '').trim()

        results.push({
            url: linkUrl,
            category: categoryText,
            description: descriptionText
        })
    }

    return results
}

const totalResults = function (html) {
    const totalSelectector = '.total_results'
    const total = parseInt($(totalSelectector, html)[0].children[0].data)

    if (total && total < 1)
        throw "Invalid Total Number of Records"

    return total;
}

const totalPages = function (html) {
    const pagesSelector = '#jPaginateNumPages'
    const numberOfPages = parseFloat($(pagesSelector, html)[0].children[0].data)

    if (numberOfPages && numberOfPages < 1)
        throw "Invalid number of pages"

    return numberOfPages
}

const readFile = promisify(fs.readFile)

let parse = [url]
let jobResults = new Array();

let resultsTotal = 0
let firstRun = true
let app = 0;

const parseJobs = async () =>
{
    try {
        for (let pageUrl of parse) {
            console.log(pageUrl)

            await rp(pageUrl)
                .then(function (buffer) {
                    const html = buffer.toString()

                    try {
                        // save locally
                        saveFile(html, `${__dirname}/listings/jobs${app}.html`)

                        // set up pages array
                        if (firstRun) {
                            const pages = totalPages(html.toString())
                            for (let i = 1; pages > i && i <= pages; i++) {
                                parse.push(url + '/page' + parseInt(i + 1))
                            }
                            firstRun = false
                            resultsTotal = totalResults(html)
                        }

                        jobResults = jobs(html, jobResults)

                    } catch (e) {
                        log(e.message)
                    }

                    app++;


                })
                .catch(function (err) {
                    // handle error
                    log(err.message)
                })
        }
    } catch (error) {
        throw error
    }

    // save to file
    saveFile(JSON.stringify({"jobs": jobResults }), `${__dirname}/data/results.json`)
    slack.success('Website Scrape Completed')
}

try {
    parseJobs()
} catch (error) {
    // handle error
    log(error.message)
}