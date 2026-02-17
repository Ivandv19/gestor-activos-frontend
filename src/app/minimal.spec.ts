import { TestBed, waitForAsync } from "@angular/core/testing";

describe("Minimal TestBed", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: []
        });
    }));

    it("should configure testing module", () => {
        expect(TestBed).toBeTruthy();
    });
});
