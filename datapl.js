	var linkplayer;
	var linkpl = ''; 
	var statusplay = false;
	var volumevelue;
	var urltitle = ''; 
	$('#radioinfo').append('<audio id="player" style="display:none;"></audio>');


		function setCookie (name, value, expires, path, domain, secure) {
					document.cookie = name + "=" + escape(value) +
						((expires) ? "; expires=" + expires : "") +
						((path) ? "; path=" + path : "") +
						((domain) ? "; domain=" + domain : "") +
						((secure) ? "; secure" : "");
		}

		function getCookie(name) {
		var cookie = " " + document.cookie;
		var search = " " + name + "=";
		var setStr = null;
		var offset = 0;
		var end = 0;
		if (cookie.length > 0) {
			offset = cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = cookie.indexOf(";", offset)
					if (end == -1) {
						end = cookie.length;
					}
				setStr = unescape(cookie.substring(offset, end));
				}
			}
			return(setStr);
		}

		function get_cookie ( cookie_name )
		{
			var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
		 
			if ( results )
				return ( unescape ( results[2] ) );
			else
				return null;
		}

		function win2unicode(str) {
   var charmap   = unescape(
      "%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+
      "%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+
      "%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+
      "%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457")
   var code2char = function(code) {
               if(code >= 0xC0 && code <= 0xFF) return String.fromCharCode(code - 0xC0 + 0x0410)
               if(code >= 0x80 && code <= 0xBF) return charmap.charAt(code - 0x80)
               return String.fromCharCode(code)
            }
   var res = ""
   for(var i = 0; i < str.length; i++) res = res + code2char(str.charCodeAt(i))
   return res
	}

function checkserver(url){
var http = new XMLHttpRequest();
http.open("GET",url,true);
http.onreadystatechange = function() {
    if(http.readyState != 4) return;
    console.log(http.status); 
    console.log(http.getAllResponseHeaders());
}
http.send(null);
}

		function updateMusic()
		{
				linkplayer = 'http://giss.tv:8001/musicandtastes3.mp3';
				
				$.getJSON('http://free.radioheart.ru:8000/json.xsl?mount=/musicandtastes', function(data) {
				if(data.mounts[0] !== ''){
				$('#title').text(data.mounts[0].title);
				linkplayer = 'http://free.radioheart.ru:8000'+data.mounts[0].mount;
				$('#list').text(data.mounts[0].listeners);
				if (data.mounts[0].listeners<1){
					$('#list').attr('style', 'color: red;');
				} else if (data.mounts[0].listeners<5){
					$('#list').attr('style', 'color: green;');
				} else if (data.mounts[0].listeners<10){
					$('#list').attr('style', 'color: blue;');
				} else if (data.mounts[0].listeners>10){
					$('#list').attr('style', 'color: yellow;');
				}
				$('#bit').text(data.mounts[0].bitrate);

				if (data.mounts[0].title.indexOf(' / ')!==-1 && data.mounts[0].title.indexOf(':')!==-1){
					urltitle = data.mounts[0].title.substring(data.mounts[0].title.indexOf(' / '),data.mounts[0].title.indexOf(' - '));
					$.getJSON('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+urltitle+'&api_key=2b35547bd5675d8ecb2b911ee9901f59&format=json', function(data2) {
				if (data2.artist!==''){
					if (data2.artist.image[3]['#text']==''){
						$('#pictions').attr('src', '/js/noname.png');
					} else {
						$('#pictions').attr('src', data2.artist.image[3]['#text']);
					}
					
				}
				
				});
				} else if (data.mounts[0].title.indexOf(':')==-1){
					urltitle = data.mounts[0].title.substring(0,data.mounts[0].title.indexOf(' - '));
					$.getJSON('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+urltitle+'&api_key=2b35547bd5675d8ecb2b911ee9901f59&format=json', function(data2) {
				if (data2.artist!==''){
					if (data2.artist.image[3]['#text']==''){
						$('#pictions').attr('src', '/js/noname.png');
						$('#lastlink').attr('href', '#');
						$('#lastlink').attr('target', '');
						$('#pictions').attr('title', '');
						$('#lastlink').removeAttr('href');
					} else {
						$('#pictions').attr('src', data2.artist.image[3]['#text']);
						$('#lastlink').attr('href', data2.artist.url);
						$('#lastlink').attr('target', '_blank');
						$('#pictions').attr('title', data.mounts[0].title);
					}
					
				}
				
				});
				}
				} else if (data.mounts[0] == ''){
					$('#title').text('Включена переадресация потока!');
				}
		});
			
		}

		function playerplay(){
			console.log(player.paused);
			if (player.paused === true) {
				$('#player').attr('src', linkplayer);
				setCookie('playerlink',linkplayer);
				player.play();
				setCookie('playerstat',''+player.paused+'');
				$('#link').removeClass('linkpause');
				$('#link').addClass('linkplay');
				player.volume = volumevelue;
			} else {
				$('#player').attr('src', '');
				$('#link').removeClass('linkplay');
				$('#link').addClass('linkpause');
				setCookie('playerstat',''+player.paused+'');
			}
			
		}

		function volume(e) {
			player.volume = e;
			volumevelue = player.volume;
			setCookie('playervolume',player.volume);
			console.log(e);
		}

		function loadkoki(){
			linkpl = get_cookie('playerlink');
			statusplay = get_cookie('playerstat');
			volumevelue = get_cookie('playervolume');
		}
loadkoki();

		$(document).ready(
		function () {
				updateMusic();
				console.log('status:'+statusplay);
				console.log('link:'+linkpl);
				player.volume = volumevelue;
				if (statusplay=="false"){
				$('#linkvolume').attr('value', player.volume);
				if (linkplayer!==''){
					$('#player').attr('src', linkpl);
					player.play();
				} else if (linkplayer==''){
					$('#player').attr('src', linkplayer);
					player.play();
				}
				}
				if (player.paused == false) {
					$('#link').removeClass('linkpause');
					$('#link').addClass('linkplay');
				}
				if (player.paused == true) {
					$('#link').removeClass('linkplay');
					$('#link').addClass('linkpause');
				}
				

				setInterval('updateMusic()', 5000 ); // интервал обновления, сейчас 3 сек.
			});