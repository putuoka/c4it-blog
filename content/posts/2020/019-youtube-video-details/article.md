---
title: "How to get video details from YouTube with .NET Core 3"
path: "/blog/get-youtube-video-details-dotnet"
tags: ['C#', 'dotNET', 'YouTube']
featuredImage: "./cover.jpg"
excerpt: "We have already seen how to search for videos in a YouTube channel. Now it's time to get details for a single video."
created: 2020-03-17
updated: 2020-03-17
---


I have already talked about how to retrieve a list of YouTube videos by its channel ID.

Now it's time to check the details of a single video.
Let's say that you like a song, you listen to it at least 2 times a day and you want to download its description because it contains the lyrics. 

And let's say that this song is _Tooth Fairy_ by Nanowar of Steel.

<div class="videoWrapper">
    <iframe  src="https://www.youtube.com/embed/CzvQxQYKO88" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
</div>

You can just copy and paste, right? Nah, too easy! 😁

## Initial steps

The basic setup is the same I explained in [my previous article](/blog/search-youtube-videos-dotnet "My article about how to search for videos on YouTube") about how to search for videos on a YouTube channel.

What you need to do is:

1. Retrieve you API key;
2. Create a .NET Core application
3. Install `Google.Apis` and `Google.Apis.YouTube.v3` NuGet packages
4. Create the class that will hold the video details:

```cs
public class YouTubeVideoDetails
{
    public string VideoId { get; set; }
    public string Description { get; set; }
    public string Title { get; set; }
    public string ChannelTitle { get; set; }
    public DateTime? PublicationDate { get; set; }
}
```

Also, since you want to get the details of a video, you need the VideoId. You can retrieve it in 2 ways: programmatically, using the procedure from the previous article, or analyzing the YouTube URL: if we have https://www.youtube.com/watch?v=CzvQxQYKO88, the id is _CzvQxQYKO88_.

Now we have everything we need. Let's go!

## Add a YouTube service

Again, we need to instantiate the YouTube service.

```cs
using (var youtubeService = new YouTubeService(new BaseClientService.Initializer()
{
    ApiKey = '<your api key>'
}))
{
    // your code here 
}
```

## Download video details

Since YouTube provides an object for each service, we must use the correct one, and then we need to specify the video ID:

```cs
var searchRequest = youtubeService.Videos.List("snippet");
searchRequest.Id = "CzvQxQYKO88";
```

Once we have created the request, we need to retrieve the result:

```cs
var searchResponse = await searchRequest.ExecuteAsync();
```

The searchResponse object contains various information shared with other services, like pagination. We don't need those info, and we can go straight to the video details:

```cs
var youTubeVideo = searchResponse.Items.FirstOrDefault();
```

Finally, we can populate our YouTueVideoDetails object:

```cs
YouTubeVideoDetails videoDetails = new YouTubeVideoDetails()
{
    VideoId = youTubeVideo.Id,
    Description = youTubeVideo.Snippet.Description,
    Title = youTubeVideo.Snippet.Title,
    ChannelTitle = youTubeVideo.Snippet.ChannelTitle,
    PublicationDate = youTubeVideo.Snippet.PublishedAt
};
```

The `youTubeVideo` object contains references to the thumbnails. As you might remember, in the article about [how to search for videos](/blog/search-youtube-videos-dotnet "How to search for YT videos") associated to a YouTube channel, I explained that the images that you get with the _Search_ endpoint are different to the ones here, in the _Videos_ endpoint. My suggestion is to try both the examples on my GitHub page (see below) and find the differences.

## Final result

Ok, we are ready to join all the pieces of the puzzle!

```cs
public async Task<YouTubeVideoDetails> GetVideoDetails()
{
    YouTubeVideoDetails videoDetails = null;
    using (var youtubeService = new YouTubeService(new BaseClientService.Initializer()
    {
        ApiKey = "<your-api-key>",
    }))
    {
        var searchRequest = youtubeService.Videos.List("snippet");
        searchRequest.Id = "CzvQxQYKO88";
        var searchResponse = await searchRequest.ExecuteAsync();
 
        var youTubeVideo = searchResponse.Items.FirstOrDefault();
        if(youTubeVideo!=null)
        {
            videoDetails = new YouTubeVideoDetails()
            {
                VideoId = youTubeVideo.Id,
                Description = youTubeVideo.Snippet.Description,
                Title = youTubeVideo.Snippet.Title,
                ChannelTitle = youTubeVideo.Snippet.ChannelTitle
            };
        }
    }
    return videoDetails;
}
```

You can see a full example on this [GitHub repository](https://github.com/code4it-dev/youtube-video-details "GitHub repository for this article").

Now we have the lyrics, and we are ready to learn about macroeconomics, power metal and inflation! Enjoy!
