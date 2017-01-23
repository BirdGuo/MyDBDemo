Page({
    onTap:function(event){
        wx.redirectTo({
          url: "../movies/movies",
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
})