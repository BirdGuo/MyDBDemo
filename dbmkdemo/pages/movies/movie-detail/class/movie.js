var util = require('../../../../utils/util.js')

class Movie {
    /**
     * 默认构造方法
     */
    constructor(url) {
        this.url = url;
    }

    /**
     * 获取电影数据
     */
    getMovieData(cb) {
        this.cb = cb;
        util.http(this.url,this.processDoubanData.bind(this))
    }

    processDoubanData(data) {
        console.log(data)
        if (!data) {
            return
        }

        //创建一个类
        var director = {
            avatar: "",
            name: "",
            id: ""
        }

        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large
            }



            director.name = data.directors[0].name
            director.id = data.directors[0].id
        }

        //创建内部电影类
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.cb(movie);

    }

}

/**
 * 向外暴露类
 */
export{Movie}