jest.mock('axios');

test('mockImplentation', () => {
    jest.mock('./foo'); // this happens automatically with automocking
    const foo = require('./foo');
    
    // foo is a mock function
    foo.mockImplementation(() => 42);
    expect(foo()).toBe(42);
    // > 42
});