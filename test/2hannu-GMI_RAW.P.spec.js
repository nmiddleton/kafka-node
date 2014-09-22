/**
 * Created by u8013621 on 16/09/2014.
 */
'use strict';

var Producer = require('../lib/producer'),
    Client = require('../lib/client'),
    GMIRAW_msg = require('./event_source/GMI_source_RAW_100'),
    MANUF_msg  = require('./event_source/Manufactured_event_orders'),
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
                'hannu-manufactured_normal',
                'hannu-manufactured_late_crit'
            ],
            false, function (err, created) {
                done();
            });

    });
});

describe('hannu-producer-GMI_raw', function () {
    describe('#GMI_RAW', function () {
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
describe('hannu-producer-Manufactured', function () {
    describe('#Manfuf', function () {
        it('should send normalstream message into hannu-manufactured_normal topic successfully', function () {
            _.each(MANUF_msg('normal'), function (msg) {
                var stringed_msg = JSON.stringify(msg);
                producer.send([
                    { topic: 'hannu-manufactured_normal', messages: stringed_msg }
                ], function (err, message) {
                    message.should.be.ok;
                });
            });
        });
        it('should send OK and criticals out of order into hannu-manufactured_late_crit topic successfully', function () {
            _.each(MANUF_msg('late_crit'), function (msg) {
                //TODO: I wanted a failing test!
                expect(msg).to.be.ok;

            });
        });
    });
});

