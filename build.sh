mv /home/mark/buildAudience /home/mark/oldBuildAudience

meteor build /home/mark/buildAudience --server=http://thingitude.com:3000

cd /home/mark/buildAudience/android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 release-unsigned.apk hotspot-audience

/home/mark/Android/Sdk/build-tools/*/zipalign 4 release-unsigned.apk hotspot-audience.apk
