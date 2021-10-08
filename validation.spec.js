const { signUp } = require('./validation');

test('ID에는 영문 대소문자와 숫자만 사용한 3개 이상의 문자열 형식이여야 한다.', async () => {
    expect( await signUp('ozam', '555556', '555556')).toEqual(true);
    expect( await signUp('CRIMINAL', '555556', '555556')).toEqual(true);
    expect( await signUp('denny415', '555556', '555556')).toEqual(true);
    expect( await signUp('123123', '555556', '555556')).toEqual(true);
    expect( await signUp('ozam_', '555556', '555556')).toEqual(false);
    expect( await signUp('o+z%am', '555556', '555556')).toEqual(false);
    expect( await signUp('oz', '555556', '555556')).toEqual(false);

});

test('passWord는 숫자 5자리 이상이면서 ID와 동일한 값이 들어갈 수 없다.', async () => {
    expect( await signUp('ozam', '555556', '555556')).toEqual(true);
    expect( await signUp('ozam', '12345', '12345')).toEqual(true);
    expect( await signUp('ozam', 'c12345', 'c12345')).toEqual(false);
    expect( await signUp('ozam', '123b45', '123b45')).toEqual(false);
    expect( await signUp('123123', '123123', '123123')).toEqual(false);
    expect( await signUp('criMINal', '1234', '1234')).toEqual(false);
    
});

test('passWord와 confirmPassword는 동일한 값이여야 한다.', async () => {
    expect( await signUp('ozam', '555556', '555556')).toEqual(true);
    expect( await signUp('ozam', '12345', '12345')).toEqual(true);
    expect( await signUp('ozam', '123123', '123123')).toEqual(true);
    expect( await signUp('ozam', '12335', '12345')).toEqual(false);
    expect( await signUp('ozam', '111111', '222222')).toEqual(false);
    expect( await signUp('ozam', '1234', '1234')).toEqual(false);
    
});
