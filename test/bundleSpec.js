import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './build/d3fc-axis.js'
            ],
            done: (_, win) => {
                const axis = win.fc.axis();
                expect(axis).not.toBeUndefined();
                done();
            }
        });
    });
});
