/**
 * Created by u8013621 on 16/09/2014.
 */
'use strict';

var Producer = require('../lib/producer'),
    Client = require('../lib/client'),
    GMIRAW_msg = require('./event_source/GMI_source_RAW_100'),
    Moment = require('moment'),
    _ = require('lodash');


var client, producer;
var now = new Moment();


before(function (done) {
    client = new Client();
    producer = new Producer(client);
    producer.on('ready', function () {
        producer.createTopics([
                'hannu-gmiRAW',
            ],
            false, function (err, created) {
                done();
            });

    });
});

describe('hannu-producer-GMI_raw', function () {
    describe('#send', function () {
        it('should send GMI_RAW message into hannu-gmiRAW topic successfully', function () {
            _.each(GMIRAW_msg(), function (msg) {
                var stringed_msg = JSON.stringify(msg);
                producer.send([
                    { topic: 'hannu-gmiRAW', messages: stringed_msg }
                ], function (err, message) {
                    message.should.be.ok;
                });
            });
        });
    });
});

