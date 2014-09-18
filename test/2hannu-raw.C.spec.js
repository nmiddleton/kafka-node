/**
 * Created by u8013621 on 16/09/2014.
 */
'use strict';
var libPath = process.env['KAFKA_COV'] ? '../lib-cov/' : '../lib/',
    Consumer = require(libPath + 'consumer'),
    Producer = require(libPath + 'producer'),
    Offset = require(libPath + 'offset'),
    Client = require(libPath + 'client'),
    TopicsNotExistError = require(libPath + 'errors').TopicsNotExistError,
    Moment = require('moment'),
    expect = require('chai').expect;

var client, consumer, producer, offset;

var host = process.env['KAFKA_TEST_HOST'] || '';
function noop() {
    console.log(arguments)
}

function offsetOutOfRange(topic, consumer) {
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
        consumer.setOffset(topic.topic, topic.partition, min);
    });
}

var topics = ['hannu-raw',
    'hannu-normalised',
    'hannu-correlated-1',
    'hannu-CUDL-enriched',
    'hannu-correlated-2',
    'hannu-final'
];

var consumer_group = 'hannu-consumers';

var now = new Moment().toString();
var hannu_raw_msg_1 = {
            end_point: "endpoint_1",
            summary: "A computer is having a crisis about CPU!",
            status: "warning",
            occurred_at: "2014-09-16T17:50:42.000Z",
            producer_hannu_raw_sent_at: now
        };

beforeEach(function (done) {
    client = new Client();
    producer = new Producer(client);
    offset = new Offset(client);

    // Now produce a fresh message
    producer.on('ready', function () {
        producer.createTopics(topics, false, function (err, created) {
            producer.send([
                { topic: 'hannu-raw', messages: JSON.stringify(hannu_raw_msg_1 , null, 1)}
            ], function (err) {
                done(err);
            });
        });
    });
});

//=================================================

describe('hannu-normalised', function () {
    describe('events', function () {
        it('should consume JSON message when get new message on hannu-raw', function (done) {
            var topics = [
                    { topic: 'hannu-raw' }
                ],
                options = { autoCommit: false, groupId: consumer_group};
            var consumer = new Consumer(client, topics, options);
            var count = 0;
            consumer.on('error', noop);
            consumer.on('offsetOutOfRange', function (topic) {
                offsetOutOfRange.call(null, topic, this);
            });
            consumer.on('message', function (message) {
                message.topic.should.equal('hannu-raw');
               console.log(">>"+message.value+"<<");
                var parsed_msg = JSON.parse(message.value);
                expect(parsed_msg).to.have.property('end_point', hannu_raw_msg_1.end_point);
                expect(parsed_msg).to.have.property('summary', hannu_raw_msg_1.summary);
                expect(parsed_msg).to.have.property('status', hannu_raw_msg_1.status || 'warning');
                expect(parsed_msg).to.have.property('occurred_at', hannu_raw_msg_1.occurred_at);
                //skip the producer_hannu_raw_sent_at property - moment will cause timestamp to be different per message
                expect(parsed_msg).to.have.property('producer_hannu_raw_sent_at');
                message.partition.should.equal(0);
                offset.commit(consumer_group, [message], function (err) {
                    if (count++ === 0) done(err);
                });
            });
        });
    });
});
