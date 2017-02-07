import { Movie } from 'class/movie.js';
var app = getApp();

Page({
    data: {
        movie: {},
        visible: false
    },
    onLoad: function (options) {
        var movieId = options.id;
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
        var movie = new Movie(url);

        movie.getMovieData((movie) => {
            this.setData({
                movie: movie
            });
            this.setData({
                visible: true
            });
        })

    },

    /**
     * 查看图片
     */
    viewMoviePostImg: function (e) {
        var src = e.currentTarget.dataset.src;
        wx.previewImage({
          current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
          urls: [src],
        //   success: function(res){
        //     // success
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete
        //   }
        })
    }

})