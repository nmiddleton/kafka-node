/**
 * Created by U8013621 on 21/09/2014.
 */

var _ = require('lodash'),
    Moment = require('moment');
now = new Moment().toString();

var skeleton_event = {
    end_point: "endpoint_1",
    summary: "A computer is having a crisis about CPU!"
};
var event_times = [
    "2000-09-01T00:01:00.000Z",
    "2000-09-01T00:02:00.000Z",
    "2000-09-01T00:03:00.000Z",
    "2000-09-01T00:04:00.000Z",
    "2000-09-01T00:05:00.000Z",
    "2000-09-01T00:06:00.000Z"
];

module.exports = function (typewanted) {
    var eventstream = [];
    switch (typewanted) {
        case 'normal':
            //creates 6 events 3 episodes
            _.forEach(event_times,
                function (value, index) {
                    eventstream.push(
                        _.assign(
                            {},      // create new empty objects to add to the array
                            [
                                skeleton_event,
                                {occurred_at: event_times[index]},
                                {status: (index % 2) === 0 ? 'critical' : 'ok'}   // alternate between CRITICAL - OK
                            ]
                        )
                    );
                    //console.log("INDEX:" + JSON.stringify(eventstream));
                }
            )
        break;
        case 'late_crit':
//            return [{}];
        break;
    }
    return eventstream;
};


