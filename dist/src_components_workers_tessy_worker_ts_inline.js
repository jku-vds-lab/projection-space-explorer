(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PSE"] = factory();
	else
		root["PSE"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/workers/tessy.worker.ts?inline":
/*!*******************************************************!*\
  !*** ./src/components/workers/tessy.worker.ts?inline ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = "data:video/mp2t;base64,CmltcG9ydCB3b3JrZXIgZnJvbSAiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvd29ya2VyLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5saW5lLmpzIjsKCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdvcmtlcl9mbigpIHsKICByZXR1cm4gd29ya2VyKCIvKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZXNfXyA9ICh7XG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanMhLi9zcmMvY29tcG9uZW50cy93b3JrZXJzL3Rlc3N5Lndvcmtlci50cz9pbmxpbmVcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanMhLi9zcmMvY29tcG9uZW50cy93b3JrZXJzL3Rlc3N5Lndvcmtlci50cz9pbmxpbmUgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoKG1vZHVsZSkgPT4ge1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTp2aWRlby9tcDJ0O2Jhc2U2NCxhVzF3YjNKMElDb2dZWE1nWTI5dVkyRjJaVzFoYmlCbWNtOXRJQ2RqYjI1allYWmxiV0Z1SnpzS2FXMXdiM0owSUNvZ1lYTWdiR2xpZEdWemN5Qm1jbTl0SUNkc2FXSjBaWE56SnpzS0NuWmhjaUIwWlhOemVTQTlJR1oxYm1OMGFXOXVJR2x1YVhSVVpYTnpaV3hoZEc5eUtDa2dld29nSUM4dklHWjFibU4wYVc5dUlHTmhiR3hsWkNCbWIzSWdaV0ZqYUNCMlpYSjBaWGdnYjJZZ2RHVnpjMlZzWVhSdmNpQnZkWFJ3ZFhRS0lDQm1kVzVqZEdsdmJpQjJaWEowWlhoRFlXeHNZbUZqYXloa1lYUmhMQ0J3YjJ4NVZtVnlkRUZ5Y21GNUtTQjdDaUFnSUNBdkx5QmpiMjV6YjJ4bExteHZaeWhrWVhSaFd6QmRMQ0JrWVhSaFd6RmRLVHNLSUNBZ0lIQnZiSGxXWlhKMFFYSnlZWGxiY0c5c2VWWmxjblJCY25KaGVTNXNaVzVuZEdoZElEMGdaR0YwWVZzd1hUc0tJQ0FnSUhCdmJIbFdaWEowUVhKeVlYbGJjRzlzZVZabGNuUkJjbkpoZVM1c1pXNW5kR2hkSUQwZ1pHRjBZVnN4WFRzS0lDQjlDZ29nSUdaMWJtTjBhVzl1SUdKbFoybHVZMkZzYkdKaFkyc29kSGx3WlNrZ2V3b2dJQ0FnYVdZZ0tIUjVjR1VnSVQwOUlHeHBZblJsYzNNdWNISnBiV2wwYVhabFZIbHdaUzVIVEY5VVVrbEJUa2RNUlZNcElIc0tJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29JbVY0Y0dWamRHVmtJRlJTU1VGT1IweEZVeUJpZFhRZ1oyOTBJSFI1Y0dVNklDSXVZMjl1WTJGMEtIUjVjR1VwS1RzS0lDQWdJSDBLSUNCOUNnb2dJR1oxYm1OMGFXOXVJR1Z5Y205eVkyRnNiR0poWTJzb1pYSnlibThwSUhzS0lDQWdJR052Ym5OdmJHVXViRzluS0NkbGNuSnZjaUJqWVd4c1ltRmpheWNwT3dvZ0lDQWdZMjl1YzI5c1pTNXNiMmNvSW1WeWNtOXlJRzUxYldKbGNqb2dJaTVqYjI1allYUW9aWEp5Ym04cEtUc0tJQ0I5SUM4dklHTmhiR3hpWVdOcklHWnZjaUIzYUdWdUlITmxaMjFsYm5SeklHbHVkR1Z5YzJWamRDQmhibVFnYlhWemRDQmlaU0J6Y0d4cGRBb0tDaUFnWm5WdVkzUnBiMjRnWTI5dFltbHVaV05oYkd4aVlXTnJLR052YjNKa2N5d2daR0YwWVN3Z2QyVnBaMmgwS1NCN0NpQWdJQ0F2THlCamIyNXpiMnhsTG14dlp5Z25ZMjl0WW1sdVpTQmpZV3hzWW1GamF5Y3BPd29nSUNBZ2NtVjBkWEp1SUZ0amIyOXlaSE5iTUYwc0lHTnZiM0prYzFzeFhTd2dZMjl2Y21Seld6SmRYVHNLSUNCOUNnb2dJR1oxYm1OMGFXOXVJR1ZrWjJWRFlXeHNZbUZqYXlobWJHRm5LU0I3THk4Z1pHOXVKM1FnY21WaGJHeDVJR05oY21VZ1lXSnZkWFFnZEdobElHWnNZV2NzSUdKMWRDQnVaV1ZrSUc1dkxYTjBjbWx3TDI1dkxXWmhiaUJpWldoaGRtbHZjZ29nSUNBZ0x5OGdZMjl1YzI5c1pTNXNiMmNvSjJWa1oyVWdabXhoWnpvZ0p5QXJJR1pzWVdjcE93b2dJSDBLQ2lBZ2RtRnlJSFJsYzNONUlEMGdibVYzSUd4cFluUmxjM011UjJ4MVZHVnpjMlZzWVhSdmNpZ3BPeUF2THlCMFpYTnplUzVuYkhWVVpYTnpVSEp2Y0dWeWRIa29iR2xpZEdWemN5NW5iSFZGYm5WdExrZE1WVjlVUlZOVFgxZEpUa1JKVGtkZlVsVk1SU3dnYkdsaWRHVnpjeTUzYVc1a2FXNW5VblZzWlM1SFRGVmZWRVZUVTE5WFNVNUVTVTVIWDFCUFUwbFVTVlpGS1RzS0NpQWdkR1Z6YzNrdVoyeDFWR1Z6YzBOaGJHeGlZV05yS0d4cFluUmxjM011WjJ4MVJXNTFiUzVIVEZWZlZFVlRVMTlXUlZKVVJWaGZSRUZVUVN3Z2RtVnlkR1Y0UTJGc2JHSmhZMnNwT3dvZ0lIUmxjM041TG1kc2RWUmxjM05EWVd4c1ltRmpheWhzYVdKMFpYTnpMbWRzZFVWdWRXMHVSMHhWWDFSRlUxTmZRa1ZIU1U0c0lHSmxaMmx1WTJGc2JHSmhZMnNwT3dvZ0lIUmxjM041TG1kc2RWUmxjM05EWVd4c1ltRmpheWhzYVdKMFpYTnpMbWRzZFVWdWRXMHVSMHhWWDFSRlUxTmZSVkpTVDFJc0lHVnljbTl5WTJGc2JHSmhZMnNwT3dvZ0lIUmxjM041TG1kc2RWUmxjM05EWVd4c1ltRmpheWhzYVdKMFpYTnpMbWRzZFVWdWRXMHVSMHhWWDFSRlUxTmZRMDlOUWtsT1JTd2dZMjl0WW1sdVpXTmhiR3hpWVdOcktUc0tJQ0IwWlhOemVTNW5iSFZVWlhOelEyRnNiR0poWTJzb2JHbGlkR1Z6Y3k1bmJIVkZiblZ0TGtkTVZWOVVSVk5UWDBWRVIwVmZSa3hCUnl3Z1pXUm5aVU5oYkd4aVlXTnJLVHNLSUNCeVpYUjFjbTRnZEdWemMzazdDbjBvS1RzS0NtWjFibU4wYVc5dUlIUnlhV0Z1WjNWc1lYUmxLR052Ym5SdmRYSnpLU0I3Q2lBZ0x5OGdiR2xpZEdWemN5QjNhV3hzSUhSaGEyVWdNMlFnZG1WeWRITWdZVzVrSUdac1lYUjBaVzRnZEc4Z1lTQndiR0Z1WlNCbWIzSWdkR1Z6YzJWc1lYUnBiMjRLSUNBdkx5QnphVzVqWlNCdmJteDVJR1J2YVc1bklESmtJSFJsYzNObGJHRjBhVzl1SUdobGNtVXNJSEJ5YjNacFpHVWdlajB4SUc1dmNtMWhiQ0IwYnlCemEybHdDaUFnTHk4Z2FYUmxjbUYwYVc1bklHOTJaWElnZG1WeWRITWdiMjVzZVNCMGJ5Qm5aWFFnZEdobElITmhiV1VnWVc1emQyVnlMZ29nSUM4dklHTnZiVzFsYm5RZ2IzVjBJSFJ2SUhSbGMzUWdibTl5YldGc0xXZGxibVZ5WVhScGIyNGdZMjlrWlFvZ0lIUmxjM041TG1kc2RWUmxjM05PYjNKdFlXd29NQ3dnTUN3Z01TazdDaUFnZG1GeUlIUnlhV0Z1WjJ4bFZtVnlkSE1nUFNCYlhUc0tJQ0IwWlhOemVTNW5iSFZVWlhOelFtVm5hVzVRYjJ4NVoyOXVLSFJ5YVdGdVoyeGxWbVZ5ZEhNcE93b0tJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUdOdmJuUnZkWEp6TG14bGJtZDBhRHNnYVNzcktTQjdDaUFnSUNCMFpYTnplUzVuYkhWVVpYTnpRbVZuYVc1RGIyNTBiM1Z5S0NrN0NpQWdJQ0IyWVhJZ1kyOXVkRzkxY2lBOUlHTnZiblJ2ZFhKelcybGRPd29LSUNBZ0lHWnZjaUFvZG1GeUlHb2dQU0F3T3lCcUlEd2dZMjl1ZEc5MWNpNXNaVzVuZEdnN0lHb2dLejBnTWlrZ2V3b2dJQ0FnSUNCMllYSWdZMjl2Y21SeklEMGdXMk52Ym5SdmRYSmJhbDBzSUdOdmJuUnZkWEpiYWlBcklERmRMQ0F3WFRzS0lDQWdJQ0FnZEdWemMza3VaMngxVkdWemMxWmxjblJsZUNoamIyOXlaSE1zSUdOdmIzSmtjeWs3Q2lBZ0lDQjlDZ29nSUNBZ2RHVnpjM2t1WjJ4MVZHVnpjMFZ1WkVOdmJuUnZkWElvS1RzS0lDQjlJQzh2SUdacGJtbHphQ0J3YjJ4NVoyOXVJQ2hoYm1RZ2RHbHRaU0IwY21saGJtZDFiR0YwYVc5dUlIQnliMk5sYzNNcENnb0tJQ0IyWVhJZ2MzUmhjblJVYVcxbElEMGdibVYzSUVSaGRHVW9LUzVuWlhSVWFXMWxLQ2s3Q2lBZ2RHVnpjM2t1WjJ4MVZHVnpjMFZ1WkZCdmJIbG5iMjRvS1RzS0lDQjJZWElnWlc1a1ZHbHRaU0E5SUc1bGR5QkVZWFJsS0NrdVoyVjBWR2x0WlNncE93b2dJSEpsZEhWeWJpQjBjbWxoYm1kc1pWWmxjblJ6T3dwOUNpOHFLZ29nS2lCQWNHRnlZVzBnYVc1d2RYUWdZU0JzYVhOMElHOW1JR05zZFhOMFpYSWdkbVZ5ZEdsalpYTUtJQ292Q2dvS2MyVnNaaTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R0WlhOellXZGxKeXdnWm5WdVkzUnBiMjRnS0dVcElIc0tJQ0JwWmlBb1pTNWtZWFJoTG0xbGMzTmhaMlZVZVhCbElEMDlJQ2QwY21saGJtZDFiR0YwWlNjcElIc0tJQ0FnSUhaaGNpQlpJRDBnVzEwN0Nnb2dJQ0FnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCbExtUmhkR0V1YVc1d2RYUXViR1Z1WjNSb095QnBLeXNwSUhzS0lDQWdJQ0FnTHk4Z1IyVjBJR2gxYkd3Z2IyWWdZMngxYzNSbGNnb2dJQ0FnSUNCMllYSWdjRzlzZVdkdmJpQTlJR052Ym1OaGRtVnRZVzRvWlM1a1lYUmhMbWx1Y0hWMFcybGRLVHNnTHk4Z1IyVjBJSFJ5YVdGdVozVnNZWFJsWkNCb2RXeHNJR1p2Y2lCamJIVnpkR1Z5Q2dvZ0lDQWdJQ0IyWVhJZ2RISnBZVzVuZFd4aGRHVmtJRDBnZEhKcFlXNW5kV3hoZEdVb1czQnZiSGxuYjI0dVpteGhkQ2dwWFNrN0NpQWdJQ0FnSUZrdWNIVnphQ2g3Q2lBZ0lDQWdJQ0FnYUhWc2JEb2djRzlzZVdkdmJpd0tJQ0FnSUNBZ0lDQjBjbWxoYm1kMWJHRjBhVzl1T2lCMGNtbGhibWQxYkdGMFpXUUtJQ0FnSUNBZ2ZTazdDaUFnSUNCOUlDOHZJRWRsZENCeWFXUWdiMllnZEhsd1pYTmpjbWx3ZENCM1lYSnVhVzVuQ2dvS0lDQWdJSFpoY2lCd2IzTjBUV1Z6YzJGblpTQTlJSE5sYkdZdWNHOXpkRTFsYzNOaFoyVTdDaUFnSUNCd2IzTjBUV1Z6YzJGblpTaFpLVHNLSUNCOUNuMHBPd3BsZUhCdmNuUWdaR1ZtWVhWc2RDQnVkV3hzT3c9PVwiO1xuXG4vKioqLyB9KVxuXG4vKioqKioqLyBcdH0pO1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG4vKioqKioqLyBcdFx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG4vKioqKioqLyBcdFx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge31cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Ly8gc3RhcnR1cFxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0Ly8gVGhpcyBlbnRyeSBtb2R1bGUgZG9lc24ndCB0ZWxsIGFib3V0IGl0J3MgdG9wLWxldmVsIGRlY2xhcmF0aW9ucyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanMhLi9ub2RlX21vZHVsZXMvdHMtbG9hZGVyL2luZGV4LmpzIS4vc3JjL2NvbXBvbmVudHMvd29ya2Vycy90ZXNzeS53b3JrZXIudHM/aW5saW5lXCIpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIH0pKClcbjtcbiIsICJXb3JrZXIiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7Cn0K";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/components/workers/tessy.worker.ts?inline");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=src_components_workers_tessy_worker_ts_inline.js.map