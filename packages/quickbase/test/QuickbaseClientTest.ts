import {factory} from "@gtlogistics/quickbase-client";
import {expect} from "chai";

describe('Quickbase Client', () => {
    it('should make a request with user token authorization', async () => {
        const mockFetch: typeof fetch = (request: Request) => {
            expect(request.url).to.be.equals('https://api.quickbase.com/v1/records/query');
            expect(request.method).to.be.equals('POST');
            expect(request.headers.get('QB-Realm-Hostname')).to.be.equals('https://example.com');
            expect(request.headers.get('Authorization')).to.be.equals('QB-USER-TOKEN token');

            return Promise.resolve(new Response('Stub!'));
        }
        const client = factory(mockFetch, 'https://example.com', {token: 'token'});
        const response = await client.post('records/query', {json: {from: 'bck7gp3q2'}}).text();

        expect(response).to.be.equals('Stub!');
    });

    it('should make a request with temporary authorization', async () => {
        const mockFetch: typeof fetch = (request: Request) => {
            const url = request.url;
            if (url === 'https://api.quickbase.com/v1/auth/temporary/bck7gp3q2') {
                expect(request.method).to.be.equals('GET');
                expect(request.headers.get('QB-Realm-Hostname')).to.be.equals('https://example.com');
                expect(request.headers.get('QB-App-Token')).to.be.equals('apptoken');

                return Promise.resolve(new Response(JSON.stringify({temporaryAuthorization: 'token'})));
            } else if (url === 'https://api.quickbase.com/v1/records/query') {
                expect(request.method).to.be.equals('POST');
                expect(request.headers.get('QB-Realm-Hostname')).to.be.equals('https://example.com');
                expect(request.headers.get('Authorization')).to.be.equals('QB-TEMP-TOKEN token');

                return Promise.resolve(new Response('Stub!'));
            }

            return Promise.reject(new Error(`Unknown URL ${url}`));
        }
        const client = factory(mockFetch, 'https://example.com', {appToken: 'apptoken'});
        const response = await client.post('records/query', {json: {from: 'bck7gp3q2'}}).text();

        expect(response).to.be.equals('Stub!');
    });
});
