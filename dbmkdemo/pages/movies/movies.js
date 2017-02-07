var util = require('../../utils/util.js')

var app = getApp();
Page({
    // RESTFul API JSON
    // SOAP XML
    //粒度 不是 力度
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchPanelShow: true,
    },
    onShareAppMessage: function () {
        return {
            title: '光与影1',
            desc: '进入搜索电影吧',
            path: "/pages/movies/movies"
        }
    },
    onLoad: function (event) {

        var inTheatersUrl = app.globalData.doubanBase +
            "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase +
            "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase +
            "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: "more-movie/more-movie?category=" + category,//当做参数传入页面中，在页面中使用option获取
        })
    },

    onMovieTap: function (event) {

        console.log("------------1---------------")
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "movie-detail/movie-detail?id=" + movieId
        })

    },

    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {}
        })
    },

    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true,
        })
    },

    onBindBlur: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "")
    },

    getMovieListData: function (url, settedKey, categoryTitle) {
        //当前页面导航条加载动画
        wx.showNavigationBarLoading()
        var that = this;
        wx.request({
            url: url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "json"
            }, // 设置请求的 header
            success: function (res) {
                // success
                // console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle)
            },
            fail: function () {
                // fail
                // console.log("---------------2-----------------")
                wx.hideNavigationBarLoading()
            },
            complete: function () {
                // complete
                // console.log("---------------3-----------------")
            }
        })
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = []

        this.setData({
            containerShow: true
        })
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;

            // console.log(title)

            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }

            //声明一部电影
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),//打星
                title: title,//标题
                average: subject.rating.average,//打分
                converageUrl: subject.images.large,//图片url
                movieId: subject.id//电影id
            }
            //数组添加方式.push()
            movies.push(temp)
        }
        var readyData = {};
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }

        this.setData(readyData);

        // console.log(readyData)
        //隐藏加载进度条
        wx.hideNavigationBarLoading();

    }

})