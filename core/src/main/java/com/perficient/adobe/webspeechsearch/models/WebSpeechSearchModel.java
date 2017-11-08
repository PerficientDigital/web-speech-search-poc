/*
 * Copyright 2017 - Perficient Digital
 * 
 * Licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.perficient.adobe.webspeechsearch.models;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;

import com.day.cq.commons.Externalizer;

@Model(adaptables = SlingHttpServletRequest.class)
public class WebSpeechSearchModel {

	@Inject
	@Via("resource")
	private String searchResultsPage;

	@Inject
	@Via("resource")
	private int limit;

	@Inject
	@Via("resource")
	private String selector;

	private Externalizer externalizer = null;

	private SlingHttpServletRequest request;

	public WebSpeechSearchModel(SlingHttpServletRequest request) {
		this.request = request;
		this.externalizer = request.getResourceResolver().adaptTo(Externalizer.class);
	}

	public String getSearchUrl() {
		return externalizer.absoluteLink(request, request.getScheme(), searchResultsPage) + ".html?q={TERM}&sp_c="
				+ limit + " " + selector;
	}
}