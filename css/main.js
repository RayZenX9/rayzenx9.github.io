function load_script(src, remote = true, transfer = []) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function doJb() {
  await load_script("css/misc.js");

  try {
    version.init();
    switch (version.console) {
      case 4:
        await load_script("css/ps4/constants.js");
        await load_script("css/ps4/userland.js");
        break;
      case 5:
        //A FAZER
        break;
      default:
        logger.info("Console não suportado " + version.console);
    }

    logger.info("===USERLAND===");

    let rw = undefined;
    if (arw.master === undefined) {
      rw = await init_rw();
    }

    init_arw(rw);
    init_rop();
    init_syscalls();

    logger.info("===FIM===");

    await load_script("css/loader.js");
    await load_script("css/workers.js");

    switch (version.console) {
      case 4:
        await load_script("css/ps4/kernel.js");
        break;
      case 5:
        //A FAZER
        break;
      default:
        logger.info("Console não suportado " + version.console);
    }

    if (fn.setuid.invoke(0) !== -1) {
      msgs.innerHTML = "GoldHEN já está carregado ...";
      return;
    }

    var exploitChain = localStorage.getItem("exploitChain") || "lapse";
    await load_script("css/" + exploitChain + ".js");
    logger.info("===" + exploitChain.toUpperCase() + "===");

    try {
      if (exploitChain == "lapse") {
        init();
        await setup();
        await double_free_reqs2();
        leak_kaddrs();
        double_free_reqs1();
        make_karw();
        inc_karw_pipe_refcnt();

        logger.info("Limpeza do contexto corrompido iniciada...");
        remove_pktinfo_from_so(pktopts_twins[0]);
        remove_rthdr_from_so(pktopts_twins[1]);
        remove_rthdr_from_so(rthdr_twins[0]);
        logger.info("Limpeza do contexto corrompido concluída !!");
      } else {
        init();
        await setup();
        await ucred_triple_free();
        leak_kqueue();
        await make_karw();
        inc_karw_pipe_refcnt();

        logger.info("Limpeza do contexto corrompido iniciada...");
        for (let i = 0; i < triplets.length; i++) {
          remove_rthdr_from_so(triplets[i]);
        }
        remove_uaf_file();
        logger.info("Limpeza do contexto corrompido concluída !!");
      }
    } finally {
      cleanup();
    }

    find_all_proc();

    if (fn.setuid.invoke(0) === -1) {
      jailbreak();

      const kpatches_rsp = await fetch("css/ps4/patches/" + constants.KPATCH);
      const kpatches_buf = await kpatches_rsp.arrayBuffer();
      const kpatches_u8 = new Uint8Array(kpatches_buf);
      kernel_patches(kpatches_u8);

      const bin_rsp = await fetch("goldhen_2.4b18.14.bin");
      const bin_buf = await bin_rsp.arrayBuffer();
      const bin_u8 = new Uint8Array(bin_buf);
      load_bin(bin_u8);
    }

    msgs.innerHTML = "GoldHEN v2.4b18.14 carregado ...";
    logger.info("===FIM===");
  } catch (e) {
    msgs.innerHTML = "Falha ao carregar! Reinicie o seu console ...";
    msgs.style.color = "yellow";
  }
}
```[cite: 3]