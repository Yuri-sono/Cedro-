package com.cedro.model.dto;

public class AgoraTokenResponse {
    private String token;
    private String appId;
    private String channelName;
    private Integer uid;

    public AgoraTokenResponse(String token, String appId, String channelName, Integer uid) {
        this.token = token;
        this.appId = appId;
        this.channelName = channelName;
        this.uid = uid;
    }

    public String getToken() {
        return token;
    }

    public String getAppId() {
        return appId;
    }

    public String getChannelName() {
        return channelName;
    }

    public Integer getUid() {
        return uid;
    }
}
