/**
 * Created by u8013621 on 16/09/2014.
 */
'use strict';

var Producer = require('../lib/producer'),
    Client = require('../lib/client'),
    Moment = require('moment');


var client, producer;
var now = new Moment();

var hannu_raw_msg_1 = JSON.stringify(
    {
        end_point: "endpoint_1",
        summary: "A computer is having a crisis about CPU!",
        status: "critical",
        occurred_at: "2014-09-16T17:50:42.000Z",
        producer_hannu_raw_sent_at: now
    }, null, 1)
    ;
var hannu_raw_msg_2 = JSON.stringify(
    {
        end_point: "endpoint_2",
        summary: "A computer is having a crisis about Memory!",
        status: "critical",
        occurred_at: "2014-09-16T17:50:42.000Z",
        producer_hannu_raw_sent_at: now
    }, null, 1);

var hannu_storm_in_a_teacup_msgs = JSON.stringify([
    {
        end_point: "endpoint_flippy",
        summary: "A computer is having a crisis about NIC UP!",
        status: "critical",
        occurred_at: "2014-09-16T17:50:42.000Z",
        producer_hannu_raw_sent_at: now
    },
    {
        end_point: "endpoint_flappy",
        summary: "A computer is having a crisis about NIC DOWN!",
        status: "critical",
        occurred_at: "2014-09-16T17:51:42.000Z",
        producer_hannu_raw_sent_at: now
    },
    {
        end_point: "endpoint_flippy",
        summary: "A computer is having a crisis about NIC UP!",
        status: "critical",
        occurred_at: "2014-09-16T17:52:42.000Z",
        producer_hannu_raw_sent_at: now
    },
    {
        end_point: "endpoint_flappy",
        summary: "A computer is having a crisis about NIC DOWN!",
        status: "critical",
        occurred_at: "2014-09-16T17:53:42.000Z",
        producer_hannu_raw_sent_at: now
    }], null, 1);


before(function (done) {
    client = new Client();
    producer = new Producer(client);
    producer.on('ready', function () {
        producer.createTopics([
                'hannu-test',
                'hannu-raw',
                'hannu-normalised',
                'hannu-correlated-1',
                'hannu-CUDL-enriched',
                'hannu-correlated-2',
                'hannu-final'
            ],
            false, function (err, created) {
                done();
            });

    });
});

describe('hannu-producer-basic', function () {
    describe('#send', function () {
        it('should send RAW message into hannu successfully', function (done) {
            producer.send([
                { topic: 'hannu-test', messages: hannu_raw_msg_1 }
            ], function (err, message) {
                message.should.be.ok;
                done(err);
            });
        });

        it('should send RAW buffer-type message into hannu successfully', function (done) {
            //var message = new Buffer('hello kafka');
            producer.send([
                { topic: 'hannu-test', messages: hannu_raw_msg_2 }
            ], function (err, message) {
                message.should.be.ok;
                done(err);
            });
        });

        it('should support multiple messages in one topic', function (done) {
            producer.send([
                { topic: 'hannu-test', messages: hannu_storm_in_a_teacup_msgs }
            ], function (err, message) {
                message.should.be.ok;
                done(err);
            });
        });
    });
});

