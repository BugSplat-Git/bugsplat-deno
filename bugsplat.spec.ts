import { BugSplat } from "./bugsplat.ts";
import { test, TestSuite } from "https://deno.land/x/test_suite@v0.6.3/mod.ts";
import { Stub, stub } from "https://deno.land/x/mock@v0.9.4/mod.ts";
import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

interface BugSplatSuiteContext {
  bugsplat: BugSplat;
  fetch: Stub<any>;
}

const database = "fred";
const appName = "my-deno-crasher-test";
const appVersion = "1.0";
const fakeJson = async () => "success!";
let fakeFormData: any;
let fakeFormDataValues: Array<any>;
let fetchStub: Stub<any>;
let formDataStub: Stub<any>;

const bugSplatSuite: TestSuite<BugSplatSuiteContext> = new TestSuite({
  name: "BugSplat",
  beforeEach(context: BugSplatSuiteContext) {
    context.bugsplat = new BugSplat(database, appName, appVersion);

    fakeFormDataValues = [];
    fakeFormData = <any> {
      append: (key: any, value: any) => {
        fakeFormDataValues[key] = value;
      },
    };

    formDataStub = stub(context.bugsplat, "_formData", [fakeFormData]);
    fetchStub = stub(globalThis, "fetch", [{
      status: 200,
      json: fakeJson,
    }]);
  },
});

test(
  bugSplatSuite,
  "post should call fetch with url, method and body",
  (context: BugSplatSuiteContext) => {
    const expectedUrl = `https://${database}.bugsplat.com/post/js/`;
    const error = new Error("BugSplat rocks");

    context.bugsplat.post(error);

    assertEquals(fetchStub.calls, [{
      args: [
        expectedUrl,
        {
          body: fakeFormData,
          method: "POST",
        },
      ],
      returned: {
        status: 200,
        json: fakeJson,
      },
    }]);
  },
);