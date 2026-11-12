/*
*=========================================
*       INSTALLATION INSTRUCTIONS
*=========================================
*
* 1) Make a copy:
*      New Interface: Go to the project overview icon on the left (looks like this: ⓘ), then click the "copy" icon on the top right (looks like two files on top of each other)
*      Old Interface: Click in the menu "File" > "Make a copy..." and make a copy to your Google Drive
* 2) Settings: Edit Config.gs to set your calendar mappings and sync options
* 3) Install:
*      New Interface: Make sure your toolbar says "install" to the right of "Debug", then click "Run"
*      Old Interface: Click "Run" > "Run function" > "install"
* 4) Authorize: You will be prompted to authorize the program and will need to click "Advanced" > "Go to GAS-CalSync (unsafe)"
*      - For steps to follow in authorization, see this video: https://youtu.be/_5k10maGtek?t=1m22s
*      - To learn more about the permissions requested by the script visit https://github.com/derekantrican/GAS-ICS-Sync/wiki/Understanding-Permissions-in-GAS%E2%80%90ICS%E2%80%90Sync
* 5) You can also run "startSync" if you want to sync only once (New Interface: change the dropdown to the right of "Debug" from "install" to "startSync")
*
* **To stop the Script from running click in the menu "Run" > "Run function" > "uninstall" (New Interface: change the dropdown to the right of "Debug" from "install" to "uninstall")
*
*=========================================
*            CONFIGURATION
*=========================================
* Edit Config.gs to set your calendar mappings and sync options.
*
*=========================================
*           ABOUT THE AUTHOR
*=========================================
*
* GAS-CalSync is based on the original program created by Derek Antrican.
*
* If you would like to see other programs Derek has made, you can check out
* his website: derekantrican.com or his github: https://github.com/derekantrican
*
*=========================================
*            BUGS/FEATURES
*=========================================
*
* Please report GAS-CalSync issues at https://github.com/rufuswilson/GAS-CalSync/issues
*
*=========================================
*           $$ DONATIONS $$
*=========================================
*
* If you would like to donate and support the project,
* you can do that here: https://wise.com/pay/me/cedricd38
*
*=========================================
*             CONTRIBUTORS
*=========================================
* Andrew Brothers
* Github: https://github.com/agentd00nut
* Twitter: @abrothers656
*
* Joel Balmer
* Github: https://github.com/JoelBalmer
*
* Blackwind
* Github: https://github.com/blackwind
*
* Jonas Geissler
* Github: https://github.com/jonas0b1011001
*
* Rufus Wilson
* Github: https://github.com/rufuswilson
*/


//=====================================================================================================
//!!!!!!!!!!!!!!!! DO NOT EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING !!!!!!!!!!!!!!!!!!!!
//=====================================================================================================

function install() {
  // Delete any already existing triggers so we don't create excessive triggers
  deleteAllTriggers();

  // Schedule sync routine to explicitly repeat and schedule the initial sync
  var adjustedMinutes = getValidTriggerFrequency(howFrequent);
  if (adjustedMinutes >= 60) {
    ScriptApp.newTrigger("startSync")
      .timeBased()
      .everyHours(adjustedMinutes / 60)
      .create();
  } else {
    ScriptApp.newTrigger("startSync")
      .timeBased()
      .everyMinutes(adjustedMinutes)
      .create();
  }
  ScriptApp.newTrigger("startSync").timeBased().after(1000).create();

  // Only the account that owns this execution may install the update trigger.
  if (isCurrentUserTriggerOwner_()) {
    ScriptApp.newTrigger("AutoUpdate")
      .timeBased()
      .everyDays(1)
      .create();
  } else {
    Logger.log("Skipping AutoUpdate trigger because the current user is not the owner");
  }
}

function uninstall() {
  deleteAllTriggers();
}

/** Public entry point used by the sync trigger and manual runs. */
function startSync() {
  return startSync_();
}

/** Run this from the Apps Script editor to preview an update without installing it. */
function PreviewUpdate() {
  return AutoUpdateImpl_(true);
}

/** Public entry point used by the daily update trigger and manual runs. */
function AutoUpdate() {
  return AutoUpdateImpl_(false);
}

/**
 * Preview or remove events created by this script from configured targets.
 * Edit the target and preview flag below before running this function.
 * Set target to a target name from sourceCalendars, or null for all targets.
 * A preview is safe: set the second argument to false only to delete.
 */
function clearGASEvents() {
  var target = null; // a target calendar name, or null for all configured targets
  var preview = true; // Is it just a preview run?
  return clearGASEvents_(target, preview);
}
