package com.cedro.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AgoraTokenRequest {

    @NotBlank(message = "channelName e obrigatorio")
    @Size(max = 64, message = "channelName deve ter no maximo 64 caracteres")
    private String channelName;

    private Boolean isVideo = true;

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public Boolean getIsVideo() {
        return isVideo;
    }

    public void setIsVideo(Boolean video) {
        isVideo = video;
    }
}
