// pages/songDetail/songDetail.js
import { getMusicDetail, getSongUrl } from '../../utils/ajax';
const appInst = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //标识是否播放
    song: {},
    musicId: ''
  },
  handleMusicPlay() {
    //更新播放状态
    this.setData({
      isPlay: !this.data.isPlay,
      musicId: this.data.song.id
    });
    let { musicId, isPlay } = this.data;
    this.audioControll(isPlay, musicId);
  },

  async audioControll(isPlay, musicId) {
    // console.log(isPlay, musicId);
    //如果是播放状态
    if (isPlay) {
      const result = await getSongUrl(musicId);
      // console.log(result);
      // 设置音乐的播放地址和标题属性
      this.backgroundAudioManager.src = result.data[0].url;
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      //暂停播放方法
      this.backgroundAudioManager.pause();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    //获取音乐详情
    this.getMusicDetail(musicId);

    if (
      appInst.globalData.musicPlay &&
      appInst.globalData.musicId === musicId
    ) {
      this.setData({
        isPlay: true
      });
    }
    //创建一个背景音乐播放实例对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    //监听播放事件
    this.backgroundAudioManager.onPlay(() => {
      this.changeState(true);
      appInst.globalData.musicId = musicId;
    });
    // 监听暂停播放事件
    this.backgroundAudioManager.onPause(() => {
      this.changeState(false);
    });
    // 监听暂停播放事件
    this.backgroundAudioManager.onStop(() => {
      this.changeState(false);
    });
  },

  //修改状态
  changeState(isPlay) {
    this.setData({
      isPlay
    });
    appInst.globalData.musicPlay = isPlay;
  },

  //获取音乐详情函数
  async getMusicDetail(id) {
    const data = await getMusicDetail(id);
    let song = data.songs[0];
    this.setData({
      song
    });
    wx.setNavigationBarTitle({
      title: this.data.song.name
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});
