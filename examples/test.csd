<CsoundSynthesizer>

<CsOptions>
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 100
nchnls = 2

gihandle OSCinit 7770


turnon 1


instr   1
  kf init 0
  Smsg =  ""
  nxtmsg:
  kk  OSClisten gihandle, "/foo/bar",  "fs", kf, Smsg
    if (kk == 0) goto ex
   puts Smsg, kf
    kgoto nxtmsg
  ex:
endin
</CsInstruments>
<CsScore>


</CsScore>
</CsoundSynthesizer>
