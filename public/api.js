function signOut() {
  localStorage.clear();
  window.location.href = '/';
}

function getSelf(callback) {
  $.ajax({
    type: 'GET',
    url: '/api/users/me',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (xhr, status, error) {
      console.log(status, error)
      if (status == 401) {
        alert('로그인이 필요합니다.');
      } else {
        localStorage.clear();
        alert('로그인이 필요합니다.');
      }
      window.location.href = '/';
      
    },
  });
}

function loginState() {
  const isToken = localStorage.getItem('token');
  if (isToken) {
    $('.login').css('display', 'none');
    $('.logout').css('display', 'block');
  } else {
    $('.login').css('display', 'block');
    $('.logout').css('display', 'none');
  }
}
