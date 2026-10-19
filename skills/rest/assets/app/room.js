const paths = {
 bed: '<path d="M3 17V8m18 9v-6H3m3 0V6h6v5m0-3h6a3 3 0 0 1 3 3M3 15h18M21 17v-2"/>',
 moon: '<path d="M19 15A8 8 0 0 1 9 5a8 8 0 1 0 10 10Z"/><path d="M18 3v4m-2-2h4"/>',
 cloud: '<path d="M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11 2 4 4 0 0 1 0 8Z"/>',
 heart: '<path d="m12 20-8-8C-2 5 7 0 12 7c5-7 14-2 8 5Z"/>',
 leaf: '<path d="M5 19C1 9 9 4 20 4c0 12-6 17-15 15Zm0 0 10-9M5 19l-2 3"/>',
 cup: '<path d="M4 9h13v6a6 6 0 0 1-12 0ZM17 10h2a3 3 0 0 1 0 6h-2M3 22h16M7 5V2m5 3V2"/>',
 sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
 lamp: '<path d="m8 3-4 10h16L16 3ZM12 13v8m-5 0h10"/>'
};
export const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
export const room = `<svg class="room-scene" viewBox="0 0 660 490" role="img" aria-labelledby="scene-title scene-description" xmlns="http://www.w3.org/2000/svg">
<title id="scene-title">一間有植物、書桌與柔軟床鋪的休養小室</title><desc id="scene-description">原創等角小房間。選擇休養方式時，對應的小物會亮起；可切換日夜與檯燈。</desc>
<defs><linearGradient id="floor" x2="1" y2="1"><stop stop-color="#d7b994"/><stop offset="1" stop-color="#b58c66"/></linearGradient><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b6d2cd"/><stop offset="1" stop-color="#edf0d3"/></linearGradient><radialGradient id="glow"><stop stop-color="#fff5c0" stop-opacity=".9"/><stop offset="1" stop-color="#fff5c0" stop-opacity="0"/></radialGradient><pattern id="wood" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V30" stroke="#987451" stroke-opacity=".2" stroke-width="2"/></pattern></defs>
<ellipse cx="329" cy="428" rx="225" ry="24" fill="#687d65" opacity=".12"/>
<g stroke-linejoin="round" stroke-linecap="round">
<path d="m80 305 250-146 250 146-250 148Z" fill="#8d7254" stroke="#826b51" stroke-width="2"/>
<path d="m80 295 250-146 250 146-250 148Z" fill="url(#floor)" stroke="#a78765" stroke-width="2"/>
<path d="m80 295 250-146 250 146-250 148Z" fill="url(#wood)"/>
<path class="wall-left" d="M80 295V122L330 20v129Z" fill="#e9e4cd" stroke="#9eab91" stroke-width="3"/>
<path class="wall-right" d="M330 20 580 122v173L330 149Z" fill="#d5ddc3" stroke="#9eab91" stroke-width="3"/>
<path d="m82 283 248-140 248 140" fill="none" stroke="#b2b392" stroke-width="7"/>
<g class="scene-object" data-object="window"><path d="m116 124 110-47v116l-110 55Z" fill="#9a7856" stroke="#8f7659" stroke-width="4"/><path class="window-sky" d="m122 128 98-42v102l-98 48Z" fill="url(#sky)"/><path d="m122 205 25-37 18 15 20-36 35 16v25l-98 48Z" fill="#94b18b"/><path d="m122 221 48-40 50 1v6l-98 48Z" fill="#799876"/><path d="m171 108v104m-49-37 98-46" stroke="#eadfc5" stroke-width="5"/><path d="m107 118 125-52" stroke="#94775a" stroke-width="5"/><path d="m111 123 20-8v117l-21 14Z" fill="#a7b8ac"/><path d="m204 85 23-9v119l-23 10Z" fill="#a7b8ac"/><path d="m119 123v109m94-140v97" stroke="#869f94" stroke-width="2"/><circle class="night-moon" cx="193" cy="124" r="10" fill="#fff2b6"/>
</g>
<g><path d="m265 93 39-16v48l-39 19Z" fill="#cba777" stroke="#ae8e65" stroke-width="3"/><path d="m270 96 29-12v37l-29 14Z" fill="#e6c2a3"/><path d="m274 125 20-29m-14 21 12-2" stroke="#738766" stroke-width="3"/></g>
<g><path d="m361 80 139 57v9l-139-57Z" fill="#977653"/><path d="m361 76 14-6 139 56-14 11Z" fill="#c3a47c"/><path d="m386 74 9 4V51l-9-4Z" fill="#b88b65"/><path d="m398 79 9 4V51l-9-4Z" fill="#8eaa9a"/><path d="m410 84 10 4V58l-10-4Z" fill="#e6d9b1"/><path d="m423 89 8 4V66l-8-4Z" fill="#aa7462"/><path d="m474 109 15 6 6-20-27-10Z" fill="#d7b68f"/><path d="M481 95V64m0 15q-26-2-18-19 18 1 18 19m1 5q26-4 21-20-20 0-21 20" fill="#739264" stroke="#607c54" stroke-width="2"/></g>
<g class="scene-object" data-object="bed"><path d="m112 299 86-48 117 64-87 53Z" fill="#9a7755" stroke="#826448" stroke-width="2"/><path d="M113 299v15m114 53v16m86-66v15" stroke="#836343" stroke-width="7"/><path d="m110 285 88-48 120 65-90 52Z" fill="#f5eddb" stroke="#c9c4a9" stroke-width="2"/><path d="m110 285 118 69v12l-118-65Z" fill="#ddd5bb"/><path d="m228 354 90-52v11l-90 53Z" fill="#cbc9a8"/><path d="m143 268 54-30 118 65-86 50-92-52Z" fill="#a5b18d"/><path d="m137 300 92 53v13l-92-51Z" fill="#8d9e77"/><path d="m229 353 86-50v12l-86 51Z" fill="#7f926b"/><path d="m116 276 49-27 35 20-48 29Z" fill="#fff9e9" stroke="#ddd7bf" stroke-width="2"/><path d="m174 276 104 57" stroke="#c6ceb1" stroke-width="2"/></g>
<g class="scene-object" data-object="rug"><path d="m279 350 82-48 117 66-83 50Z" fill="#e6dfbf" stroke="#c1bb98" stroke-width="3"/><path d="m290 350 71-41 104 59-71 43Z" fill="#b7c3a2"/><path d="m321 364 43-24 47 27-42 26Z" fill="#d7d5b6"/><ellipse cx="368" cy="361" rx="24" ry="13" fill="#f0dfbd"/><path d="M351 358q9-21 24-5 13 2 8 12-25 8-32-7" fill="#c89974"/><path d="m354 351 2-8 7 5m9 1 5-5 2 10" fill="#c89974"/><path d="M357 358h3m10 1h3" stroke="#77634d" stroke-width="2"/></g>
<g class="scene-object" data-object="desk"><path d="M351 227v76m115-15v73m58-108v73" stroke="#9d7850" stroke-width="10"/><path d="m338 221 66-38 133 75-67 39Z" fill="#cba477" stroke="#967452" stroke-width="2"/><path d="m338 221 132 76v10l-132-76Z" fill="#b18b5f"/><path d="m470 297 67-39v10l-67 39Z" fill="#a57d54"/><path d="m400 244 24-14 38 21-24 15Z" fill="#f8f3df" stroke="#c8c4a8"/><path d="m428 237-1 21m-20-14 13 7m16-6 16 8" stroke="#a4ad92"/><path d="m474 258 20-12 22 12-20 13Z" fill="#839b87"/><path d="m474 254 20-12 22 12-20 13Z" fill="#e5d8b5"/>
<path d="m401 304 35-20 35 20-35 22Z" fill="#b18e66" stroke="#967451" stroke-width="2"/><path d="M403 304v39m34-18v36m32-55v37" stroke="#967451" stroke-width="6"/><path d="M403 300v-33l33 18v35" fill="#c9ac7e" stroke="#967451" stroke-width="3"/>
</g>
<g class="scene-object" data-object="cup"><ellipse cx="390" cy="232" rx="12" ry="6" fill="#a28a66" opacity=".4"/><path d="M381 218v11q8 7 16 0v-11Z" fill="#f9f0d5" stroke="#b6aa86" stroke-width="1.5"/><ellipse cx="389" cy="218" rx="8" ry="4" fill="#c4aa80"/><path d="M398 220q10 0 0 8" fill="none" stroke="#d4c7a7" stroke-width="3"/><path d="M388 208q-6-5 0-10" fill="none" stroke="#fffcdf" stroke-width="2"/></g>
<g class="lamp-object"><ellipse class="lamp-glow" cx="464" cy="213" rx="65" ry="48" fill="url(#glow)"/><ellipse cx="466" cy="239" rx="13" ry="6" fill="#777b57"/><path d="M466 236v-36" stroke="#777b57" stroke-width="4"/><path class="lamp-shade" d="m457 178-12 26q21 12 42 0l-12-26Z" fill="#ebd9a1" stroke="#8a8c62" stroke-width="2"/></g>
<g class="scene-object" data-object="plant"><path d="m517 298 6 28q14 9 28 0l6-28Z" fill="#c6a17b" stroke="#a98764" stroke-width="2"/><ellipse cx="537" cy="298" rx="20" ry="9" fill="#a98d69"/><path d="M536 300v-63m0 44q-39-7-30-29 26 0 30 29m1-12q36-5 32-29-27-1-32 29m0-15q-27-12-18-32 24 7 18 32" fill="#7e9b6d" stroke="#607e57" stroke-width="3"/></g>
</g></svg>`;
