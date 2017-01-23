var app = getApp()
var util = require('../../../utils/util.js')


Page({
    data: {
        movies: {},
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0,//分页查询页码
        isEmpty: true,
    },

    onReady: function (event) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    },

    onLoad: function (options) {
        var category = options.category;//获取标题//从传入的url中获取
        this.data.navigateTitle = category;//页面标题设置
        var dataUrl = "";//声明访问url
        switch (category) {//构造url
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        wx.setNavigationBarTitle({
            title: category,//设置当前标题
        })
        this.data.requestUrl = dataUrl;

        console.log(dataUrl)

        // this.http(dataUrl);
        util.http(dataUrl, this.processDoubanData)
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function (event) {
        var refreshUrl = this.data.requestUrl + "?start=0&count=20";//构建url
        this.data.movies = {};
        this.data.isEmpty = true;
        this.data.totalCount = 0;
        util.http(refreshUrl, this.processDoubanData);
        wx.showNavigationBarLoading()
    },

    /**
     * 上拉加载
     */
    onReachBottom: function (event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);
        wx.hideNavigationBarLoading();
    },

       /**
     * 解析豆瓣数据
     */
    processDoubanData: function (movieDouban) {

        var movies = [];//声明电影数组

        for (var idx in movieDouban.subjects) {

            var subject = movieDouban.subjects[idx];//获取每个节点
            var title = subject.title;//获取电影名称
            console.log(title)
            if (title.length > 6) {//电影名称数字过长，截取钱留个字符
                title = title.substring(0, 6) + "..."
            }

            var temp = {//自定义电影类
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                converageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)//将自定义电影类放入数组
        }

        var totalMovies = {}
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies)
        } else {
            totalMovies = movies;//清空数组
            this.data.isEmpty = false;
        }
        this.setData({//设置本地页面电影数组
            movies: totalMovies
        })

        this.data.totalCount += 20;
        //隐藏加载进度条
        wx.hideNavigationBarLoading();
        //停止刷新
        wx.stopPullDownRefresh();
    },

})