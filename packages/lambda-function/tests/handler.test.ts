import { it } from "node:test";
import { handler } from "../src/handler";

describe('handler tests', () => {
    it("should return 'Hello, John' when name is passed", async ()=> {
        const event = { queryStringParameters : {name : 'John'}} as any
        const result = await handler(event)
        expect(JSON.parse(result.body)).toEqual({message : "Hello, John"})
    });

    it("should return 'Hello, World' when name is not passed", async ()=> {
        const event = { queryStringParameters : {}} as any
        const result = await handler(event)
        expect(JSON.parse(result.body)).toEqual({message : "Hello, World"})
    })
})