# Expose only allowlisted manifest fields to candidate index templates.
# Public IDs and sample paths still disclose outcomes until fixtures are renamed.
require 'json'
require 'digest'

module BaselineReporting
  class Catalog < Jekyll::Generator
    safe true
    # Populate data before other generators can cache a Liquid site payload.
    priority :highest

    def generate(site)
      manifest = JSON.parse(File.read(File.join(site.source, 'evaluations/test-manifest.yaml')))
      site.data['reporting_candidates'] = {
        'suite_id' => manifest.fetch('suite_id'),
        'suite_version' => manifest.fetch('suite_version'),
        'framework_revision' => manifest.fetch('source_revision'),
        'cases' => manifest.fetch('cases').select { |item| item.fetch('domain') == 'web' }.sort_by { |item| item.fetch('id') }.map do |item|
          {
            'case_id' => item.fetch('id'),
            'domain' => 'web',
            'sample' => '/' + item.fetch('sample'),
            'sample_sha256' => item.fetch('sample_sha256'),
            'case_version' => item.fetch('case_version'),
            'procedure_keys' => item.fetch('procedure_keys')
          }
        end
      }
      catalog = { 'domains' => {} }
      %w[web documents].each do |domain|
        baseline = JSON.parse(File.read(File.join(site.source, "accessibility-si/mappings/#{domain}/baseline.yaml")))
        targets = baseline.fetch('procedures').select { |p| p.fetch('disposition') == 'active' }.map do |p|
          { 'id' => p.fetch('key'), 'name' => p.fetch('id'), 'track' => 'section508-baseline', 'url' => p.fetch('url') }
        end
        criteria = JSON.parse(File.read(File.join(site.source, 'accessibility-si/mappings/wcag-a-aa.yaml')))
        criteria.fetch('criteria').reject { |c| c.fetch('introduced_in') == '2.0' }.each do |c|
          targets << { 'id' => "#{domain}:supplemental:#{c.fetch('id')}", 'name' => "#{c.fetch('id')} #{c.fetch('name')}", 'track' => c.fetch('track'), 'url' => c.fetch('normative_url') }
        end
        (1..5).each do |n|
          targets << { 'id' => "#{domain}:conformance:CR#{n}", 'name' => "Conformance requirement CR#{n}", 'track' => 'section508-conformance', 'url' => 'https://www.w3.org/TR/WCAG20/#conformance-reqs' }
        end
        keys = %w[content-scope support-documentation]
        keys << 'nonweb-substitutions' if domain == 'documents'
        keys.each do |key|
          targets << { 'id' => "#{domain}:scope:#{key}", 'name' => key.tr('-', ' '), 'track' => 'section508-scope', 'url' => 'https://www.access-board.gov/ict/' }
        end
        catalog['domains'][domain] = {
          'baseline' => { 'domain' => domain, 'version' => baseline.fetch('version'), 'source_revision' => baseline.fetch('source_revision') },
          'targets' => targets,
          'procedures' => baseline.fetch('procedures').map { |p| { 'id' => p.fetch('key'), 'disposition' => p.fetch('disposition') } },
          'dispositions' => baseline.fetch('procedures').reject { |p| p.fetch('disposition') == 'active' }.map do |p|
            { 'target_id' => p.fetch('key'), 'disposition' => p.fetch('disposition'), 'basis' => p.fetch('url') }
          end
        }
      end
      catalog['suite'] = {
        'id' => manifest.fetch('suite_id'), 'version' => manifest.fetch('suite_version'),
        'framework_revision' => manifest.fetch('source_revision'),
        'manifest_sha256' => Digest::SHA256.file(File.join(site.source, 'evaluations/test-manifest.yaml')).hexdigest,
        'expectations_sha256' => Digest::SHA256.file(File.join(site.source, 'evaluations/evaluator/expected-outcomes.yaml')).hexdigest
      }
      site.data['reporting_catalog'] = catalog
    end
  end
end
